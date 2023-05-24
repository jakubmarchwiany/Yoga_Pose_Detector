/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Stack } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import * as poseDetection from '@tensorflow-models/pose-detection'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Webcam from 'react-webcam'
import { SessionParams } from '../session_creator/types'
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

let roundClassficaiton = 0
let resizeRatio: number
let currentSkeletonColor = POSITION_NOT_DETECTED_COLOR

type Props = {
  sessionParams: SessionParams
  restartSession: () => void
}

function YogaSession({ sessionParams, restartSession }: Props): JSX.Element {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [round, setRound] = useState(0)
  const [poseCorrent, setPoseCorrent] = useState(false)
  const [posesDetected, setPosesDetected] = useState<[string, number][]>([])
  const [poseTimeLeft, setPoseTimeLeft] = useState(() => {
    if (sessionParams.mode === 'Pose_detection') return 0
    else return sessionParams.Poses[0][1]
  })
  const [pointsDetected, setPointsDetected] = useState(0)

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
      // countAudio.loop = true

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
        setPointsDetected(17 - notDetectedPoints)
        if (notDetectedPoints > 4) {
          currentSkeletonColor = POSITION_NOT_DETECTED_COLOR
          return
        }

        const processedInput = landmarks_to_embedding(input)
        const classification = poseClassifier.predict(processedInput)

        const classificationArray = await classification.array()
        const posesResults = classificationArray[0]

        if (sessionParams.mode === 'Pose_detection') {
          let posesPropability = posesResults.map((x: number, index: number) => [
            AVAILABLE_POSITIONS[index],
            // x.toFixed(5)
            x.toFixed(3)
          ])

          posesPropability.sort((a, b) => b[1] - a[1])
          posesPropability = posesPropability.slice(0, 3)

          setPosesDetected(posesPropability)
        } else {
          const currentPoseIndex = INDEX_FOR_CLASS[sessionParams.Poses[roundClassficaiton][0]]

          if (posesResults[currentPoseIndex] > 0.97) {
            setPoseCorrent(true)
            // if (!flag) {
            countAudio.play()
            //   // flag = true
            // }
            currentSkeletonColor = POSITION_DETECTED_COLOR
          } else {
            setPoseCorrent(false)
            currentSkeletonColor = POSITION_NOT_DETECTED_COLOR

            // flag = false
            countAudio.pause()
            countAudio.currentTime = 0
          }
        }
      }
    }
  }
  let poseTimerInterval
  const poseTimer = () => {
    if (poseTimeLeft === 0) {
      setPoseCorrent(false)
      if (roundClassficaiton < sessionParams.Poses.length - 1) {
        setRound((prev) => prev + 1)
        setPoseTimeLeft(sessionParams.Poses[round + 1][1])
        roundClassficaiton += 1
      } else {
        roundClassficaiton=0
        toast.success('Sesja Yogi zakończona!', { icon: '🧘‍♀️', duration: 5000 })
        restartSession()
      }
    } else {
      if (poseCorrent) {
        poseTimerInterval =
          !poseTimerInterval &&
          setInterval(() => {
            console.log('interval')
            setPoseTimeLeft((prevCount) => prevCount - 1)
          }, 1000)
      } else {
        console.log('incorrect')
        clearInterval(poseTimerInterval)
      }
    }
  }

  useEffect(() => {
    if (sessionParams.mode === 'Pose_detection') return

    poseTimer()

    return () => clearInterval(poseTimerInterval)
  }, [round, poseCorrent, poseTimeLeft])

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
        <InfoPanel
          round={round}
          poseCorrent={poseCorrent}
          pointsDetected={pointsDetected}
          posesDetected={posesDetected}
          poseTimeLeft={poseTimeLeft}
          sessionParams={sessionParams}
          restartSession={restartSession}
        />
      </Grid>
    </>
  )
}
export default YogaSession
