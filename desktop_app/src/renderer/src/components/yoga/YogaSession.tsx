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
  INDEX_FOR_CLASS,
  INDEX_FOR_POINTS,
  POSITION_DETECTED_COLOR,
  POSITION_NOT_DETECTED_COLOR,
  keypointConnections
} from './data'
import { drawPoint, drawSegment } from './draw'
import InfoPanel from './info/InfoPanel'
import count from './sound/count.wav'

let currentSkeletonColor = POSITION_NOT_DETECTED_COLOR
let flag = false

type Props = {
  restartSession: () => void
  selectedCamera: string
}

function YogaSession({ restartSession, selectedCamera }: Props): JSX.Element {
  const [poseToDetect, setPoseToDetect] = useState('Tree')

  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const toastId = toast.loading('Uruchamianie modelu...')
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

      detectPoseInterval = setInterval(async () => {
        await detectPose(detector, poseClassifier, countAudio, toastId)
      }, 500)
    }
    runModel()

    return () => {
      clearInterval(detectPoseInterval)
    }
  }, [])

  const detectPose = async (detector, poseClassifier, countAudio, toastId) => {
    if (webcamRef.current && canvasRef.current) {
      let notDetected = 0
      const video = webcamRef.current.video
      const pose = await detector.estimatePoses(video)
      toast.success('Model został uruchomiony', {
        id: toastId
      })

      const ctx = canvasRef.current!.getContext('2d')
      ctx!.clearRect(0, 0, canvasRef.current.width, canvasRef.current?.height)

      if (pose.length > 0) {
        const keypoints = pose[0].keypoints
        let input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 10, 'rgb(255,255,255)')
              let connections = keypointConnections[keypoint.name]

              if (connections !== undefined) {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase()
                  drawSegment(
                    ctx,
                    [keypoint.x, keypoint.y],
                    [
                      keypoints[INDEX_FOR_POINTS[conName]].x,
                      keypoints[INDEX_FOR_POINTS[conName]].y
                    ],
                    currentSkeletonColor
                  )
                })
              }
            }
          } else {
            notDetected += 1
          }
          return [keypoint.x, keypoint.y]
        })

        if (notDetected > 4) {
          currentSkeletonColor = POSITION_NOT_DETECTED_COLOR
          return
        }

        const processedInput = landmarks_to_embedding(input)
        const classification = poseClassifier.predict(processedInput)
        classification.array().then((data) => {
          const currentPoseIndex = INDEX_FOR_CLASS[poseToDetect]

          if (data[0][currentPoseIndex] > 0.97) {
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
        })
      }
    }
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0))
    let embedding = tf.reshape(landmarks, [1, 34])
    return embedding
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(
      landmarks,
      INDEX_FOR_POINTS.LEFT_HIP,
      INDEX_FOR_POINTS.RIGHT_HIP
    )
    pose_center = tf.expandDims(pose_center, 1)
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2])
    landmarks = tf.sub(landmarks, pose_center)

    let pose_size = get_pose_size(landmarks)
    landmarks = tf.div(landmarks, pose_size)
    return landmarks
  }

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1)
    let right = tf.gather(landmarks, right_bodypart, 1)
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
    return center
  }

  function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
    let hips_center = get_center_point(
      landmarks,
      INDEX_FOR_POINTS.LEFT_HIP,
      INDEX_FOR_POINTS.RIGHT_HIP
    )
    let shoulders_center = get_center_point(
      landmarks,
      INDEX_FOR_POINTS.LEFT_SHOULDER,
      INDEX_FOR_POINTS.RIGHT_SHOULDER
    )
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
    let pose_center_new = get_center_point(
      landmarks,
      INDEX_FOR_POINTS.LEFT_HIP,
      INDEX_FOR_POINTS.RIGHT_HIP
    )
    pose_center_new = tf.expandDims(pose_center_new, 1)

    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2])
    // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
    let max_dist = tf.max(tf.norm(d, 'euclidean', 0))

    // normalize scale
    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
    return pose_size
  }

  return (
    <>
      <Grid xs={9}>
        <Stack sx={{ height: '100vh' }}>
          <Webcam
            width="640px"
            height="480px"
            id="webcam"
            ref={webcamRef}
            videoConstraints={{ deviceId: { exact: selectedCamera } }}
            style={{
              position: 'absolute',
              //   left: 120,
              //   top: 100,
              padding: '0px'
            }}
          />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width="640px"
            height="480px"
            style={{
              position: 'absolute',
              //   left: 120,
              //   top: 100,
              zIndex: 1
            }}
          ></canvas>
        </Stack>
      </Grid>
      <Grid xs={3}>
        <InfoPanel restartSession={restartSession} />
      </Grid>
    </>
  )
}
export default YogaSession
