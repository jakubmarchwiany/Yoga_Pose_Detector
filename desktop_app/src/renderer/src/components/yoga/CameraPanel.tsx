import { Stack } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import { dataURLtoFile } from '@renderer/utils/dataURLToFile'
import { imageFetch } from '@renderer/utils/fetches'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { Pose } from '../session_creator/types'

type Params = {
  cameraId: string
}

function Camera({ cameraId }: Params): JSX.Element {
  useEffect(() => {
    const run = async (): Promise<void> => {
      await startCamera()
    }

    run()

    const captureImage = setInterval(() => {
      const base64EncodedImage = takepicture()
      const formData = new FormData()
      formData.append('file', dataURLtoFile(base64EncodedImage, 'pose.png'))

      imageFetch<{ pose: Pose }>(formData, '/detect_pose').then(({ pose }) => {
        toast(`Pozycja wykryta: ${pose.name}`, { icon: '🧘', id: 'pose' })
      })
    }, 100)

    return () => {
      clearInterval(captureImage)
    }
  }, [])

  const startCamera = async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: cameraId },
        frameRate: { ideal: 60 },
        width: { ideal: 1000 },
        height: { ideal: 1000 }
        // aspectRatio: 1 / 1
      }
    })
    const video: HTMLVideoElement = document.querySelector('#camera')!
    video!.srcObject = stream
    video.play()
    toast('Camera started', { icon: '📷' })
  }

  const takepicture = (): string => {
    const video = document.getElementById('camera')! as HTMLVideoElement
    const canvas = document.getElementById('canvas') as HTMLCanvasElement

    const { height, width } = video.getBoundingClientRect()
    const context = canvas.getContext('2d')!

    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    const captureImage = canvas.toDataURL('image/png')
    return captureImage
  }

  return (
    <Stack justifyContent="center" sx={{ height: '100vh' }}>
      <CardMedia id="camera" component="video" sx={{ height: '1000px' }} />
      <canvas id="canvas" style={{ display: 'none' }}></canvas>
    </Stack>
  )
}
export default Camera
