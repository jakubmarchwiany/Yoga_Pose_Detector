import express from "express";
import { YOGA_POSES } from "./yoga_poses_data.js";
import cors from "cors"
import multer from "multer"
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }))

app.get('/yoga_poses', (req, res) => {
  res.send({
    message: "Udało się pobrać pozycje",
    poses: YOGA_POSES
  }
  )
})

const upload = multer();

app.post('/detect_pose', upload.single("file" /* name attribute of <file> element in your form */), (req, res) => {
  const randomPose = YOGA_POSES[Math.floor(Math.random() * YOGA_POSES.length)]
  console.log(req.file)
  res.send({
    message: "Udało się wykryć pozycje",
    pose: randomPose
  }
  )
})

app.listen(8080, () => {
  console.log(`Example app listening on port ${8080}`)
})
