/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as tf from '@tensorflow/tfjs'
import { INDEX_FOR_POINTS } from './data'

export const landmarks_to_embedding = (landmarks) => {
  //normalize landmarks 2D
  landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0))

  //return embedding
  return tf.reshape(landmarks, [1, 34])
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

  const pose_size = get_pose_size(landmarks)

  //return landmarks
  return tf.div(landmarks, pose_size)
}

function get_center_point(landmarks, left_bodypart, right_bodypart) {
  const left = tf.gather(landmarks, left_bodypart, 1)
  const right = tf.gather(landmarks, right_bodypart, 1)

  //return center
  return tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
}

function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
  const hips_center = get_center_point(
    landmarks,
    INDEX_FOR_POINTS.LEFT_HIP,
    INDEX_FOR_POINTS.RIGHT_HIP
  )
  const shoulders_center = get_center_point(
    landmarks,
    INDEX_FOR_POINTS.LEFT_SHOULDER,
    INDEX_FOR_POINTS.RIGHT_SHOULDER
  )
  const torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
  let pose_center_new = get_center_point(
    landmarks,
    INDEX_FOR_POINTS.LEFT_HIP,
    INDEX_FOR_POINTS.RIGHT_HIP
  )
  pose_center_new = tf.expandDims(pose_center_new, 1)

  pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2])
  //return: shape(17,2)
  const d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
  const max_dist = tf.max(tf.norm(d, 'euclidean', 0))

  //normalize scale
  //return pose_size
  return tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
}
