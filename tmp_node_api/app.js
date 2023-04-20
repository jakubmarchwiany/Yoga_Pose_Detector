import express from "express";
import { YOGA_POSES } from "./yoga_poses_data.js";
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/yoga_poses', (req, res) => {
  res.send(
    YOGA_POSES
  )
})

app.get('/detect_pose', (req, res) => {
  const randomPose = YOGA_POSES[Math.floor(Math.random() * YOGA_POSES.length)]

  res.send(
    randomPose
  )
})

app.listen(8080, () => {
  console.log(`Example app listening on port ${8080}`)
})
