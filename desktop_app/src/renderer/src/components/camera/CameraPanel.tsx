import { Stack } from '@mui/material'
import CardMedia from '@mui/material/CardMedia'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

type Params = {
  cameraId: string
}

function Camera({ cameraId }: Params): JSX.Element {
  useEffect(() => {
    startCamera()
    const captureImage = setInterval(() => {
      takepicture()
    }, 1000)

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

  const takepicture = (): void => {
    const video = document.getElementById('camera')! as HTMLVideoElement
    const canvas = document.getElementById('canvas') as HTMLCanvasElement

    const { height, width } = video.getBoundingClientRect()
    const context = canvas.getContext('2d')!

    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    const captureImage = canvas.toDataURL('image/png')
    console.log(captureImage.length)
  }

  return (
    <Stack justifyContent="center" sx={{ height: '100vh' }}>
      <CardMedia id="camera" component="video" sx={{ height: '1000px' }} />
      <canvas id="canvas" style={{ display: 'none' }}></canvas>
    </Stack>
  )
}
export default Camera
