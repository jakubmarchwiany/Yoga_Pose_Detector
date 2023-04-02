import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type CameraParameters = { label: string; deviceId: string }

function Camera() {
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [availableCameras, setAvailableCameras] = useState<CameraParameters[]>([])

  useEffect(() => {
    getAvailableCameras()
  }, [])

  const getAvailableCameras = async () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const availableCameras: CameraParameters[] = []

        devices.map((device) => {
          if (device.kind === 'videoinput')
            availableCameras.push({ label: device.label, deviceId: device.deviceId })
        })
        setAvailableCameras(availableCameras)
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`)
      })
  }

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedCamera(event.target.value as string)
  }

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: selectedCamera }, frameRate: { ideal: 60 } }
    })
    console.log(stream)
    const video = document.querySelector('#video')
    video!.srcObject = stream
    toast('Camera started', { icon: '📷' })
  }

  return (
    <Box mt={5}>
      {availableCameras.length === 0 ? (
        <Typography variant="h4">No cameras found :(</Typography>
      ) : (
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel id="choose-camera">Choose camera</InputLabel>
          <Select
            fullWidth
            labelId="choose-camera"
            label="Choose camera"
            value={selectedCamera}
            onChange={handleChange}
          >
            {availableCameras.map((camera) => {
              return (
                <MenuItem key={camera.deviceId} value={camera.deviceId}>
                  {camera.label}
                </MenuItem>
              )
            })}
          </Select>
          <Button variant="outlined" onClick={startCamera} disabled={selectedCamera === ''}>
            Start camera
          </Button>

          <CardMedia id="video" component="video" title="title" autoPlay sx={{ borderRadius: 5 }} />
        </FormControl>
      )}
    </Box>
  )
}

export default Camera
