/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Stack } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Webcam from 'react-webcam'
import {
  AVAILABLE_POSITIONS,
  INDEX_FOR_CLASS,
  INDEX_FOR_POINTS,
  POSITION_DETECTED_COLOR,
  POSITION_NOT_DETECTED_COLOR,
  keypointConnections
} from './data'
import { drawPoint, drawSegment } from './draw'
import InfoPanel from './info/InfoPanel'
import { landmarks_to_embedding } from './predictHelpers'
import count from './sound/count.wav'
import { SessionParams } from '../session_creator/types'

let currentSkeletonColor = POSITION_NOT_DETECTED_COLOR
let flag = false
let resizeRatio

type Props = {
  sessionParams: SessionParams
  restartSession: () => void
}

export type Info = {
  pointsDetected: number
  poses: [string, number][]
}

function YogaSession({ sessionParams, restartSession }: Props): JSX.Element {
  const [poseToDetect, setPoseToDetect] = useState('Tree')
  const [info, setInfo] = useState<Info>()

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let detectPoseInterval: string | number | NodeJS.Timer | undefined

    const runModel = async () => {
      const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      )
      const poseClassifier = await tf.loadLayersModel(
        'https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json'
      )

      const countAudio = new Audio(count)
      countAudio.loop = true

      let firstLoadFlag = true
      const toastId = toast.loading('Uruchamianie modelu...')
      detectPoseInterval = setInterval(async () => {
        await detectPose(detector, poseClassifier, countAudio)
        if (firstLoadFlag)
          toast.success('Model uruchomiony', {
            id: toastId
          })
        firstLoadFlag = false
      }, 250)
    }
    runModel()

    return () => {
      clearInterval(detectPoseInterval)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (!webcamRef.current || !canvasRef.current) return
      canvasRef.current.width = webcamRef.current.video!.clientWidth
      canvasRef.current.height = webcamRef.current.video!.clientHeight
      resizeRatio = webcamRef.current.video!.clientWidth / 640
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (webcamRef.current && canvasRef.current) {
      const video = webcamRef.current.video
      const estimatedPoses = await detector.estimatePoses(video)

      const canvasContext = canvasRef.current!.getContext('2d')
      canvasContext!.clearRect(0, 0, canvasRef.current.width, canvasRef.current?.height)
      canvasContext!.setTransform(-1, 0, 0, 1, canvasRef.current.width, 0)

      let notDetectedPoints = 0
      if (estimatedPoses.length > 0) {
        const keypoints = estimatedPoses[0].keypoints
        let input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(
                canvasContext,
                keypoint.x * resizeRatio,
                keypoint.y * resizeRatio,
                10,
                'rgb(255,255,255)'
              )
              let connections = keypointConnections[keypoint.name]

              if (connections !== undefined) {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase()
                  drawSegment(
                    canvasContext,
                    [keypoint.x * resizeRatio, keypoint.y * resizeRatio],
                    [
                      keypoints[INDEX_FOR_POINTS[conName]].x * resizeRatio,
                      keypoints[INDEX_FOR_POINTS[conName]].y * resizeRatio
                    ],
                    currentSkeletonColor
                  )
                })
              }
            }
          } else {
            notDetectedPoints += 1
          }
          return [keypoint.x, keypoint.y]
        })

        if (notDetectedPoints > 10) {
          currentSkeletonColor = POSITION_NOT_DETECTED_COLOR
          return
        }

        const processedInput = landmarks_to_embedding(input)
        const classification = poseClassifier.predict(processedInput)

        const classificationArray = await classification.array()
        const posesResults = classificationArray[0]

        let posesPropability = posesResults.map((x: number, index: number) => [
          AVAILABLE_POSITIONS[index],
          // x.toFixed(5)
          x.toFixed(3)
        ])

        posesPropability.sort((a, b) => b[1] - a[1])
        posesPropability = posesPropability.slice(0, 3)

        console.log(posesPropability)
        setInfo({ pointsDetected: 17 - notDetectedPoints, poses: posesPropability })

        // const mostProbablePose = posesResults.slice(0, 3).map((x) => x[0])
        // console.log(classificationArray)

        const currentPoseIndex = INDEX_FOR_CLASS[poseToDetect]

        // posesPropability.sort((a, b) => b[1] - a[1])
        // posesPropability.slice(0, 3)

        // posesPropability.map((x) => console.log(x[0] + ' ' + x[1]))

        if (posesResults[currentPoseIndex] > 0.97) {
          if (!flag) {
            countAudio.play()
            // setStartingTime(new Date(Date()).getTime())
            // flag = true
          }
          // setCurrentTime(new Date(Date()).getTime())
          currentSkeletonColor = POSITION_DETECTED_COLOR
        } else {
          // flag = false
          currentSkeletonColor = POSITION_NOT_DETECTED_COLOR
          countAudio.pause()
          countAudio.currentTime = 0
        }
      }
    }
  }

  return (
    <>
      <Grid xs={9}>
        <Stack sx={{ height: '100vh' }}>
          <Webcam
            height={'100%'}
            id="webcam"
            ref={webcamRef}
            mirrored={true}
            style={{
              // position: 'absolute',
              padding: '0px'
            }}
          />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            style={{
              position: 'absolute'
            }}
          ></canvas>
        </Stack>
      </Grid>
      <Grid xs={3}>
        <InfoPanel info={info!} sessionParams={sessionParams} restartSession={restartSession} />
      </Grid>
    </>
  )
}
export default YogaSession
