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
  }, [])

  const startCamera = async (): Promise<void> => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: cameraId },
        frameRate: { ideal: 60 }
      }
    })
    const video: HTMLVideoElement = document.querySelector('#camera')!
    video!.srcObject = stream
    toast('Camera started', { icon: '📷' })
  }

  return (
    <Stack justifyContent="center" sx={{ height: '100vh' }}>
      <CardMedia id="camera" component="video" autoPlay sx={{ maxHeight: '100vh' }} />
    </Stack>
  )
}
export default Camera
