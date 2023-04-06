import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { CameraParameters } from './types'

type Params = {
  startSession: (cameraId: string) => void
}

function SessionCreatorPanel({ startSession }: Params): JSX.Element {
  const [availableCameras, setAvailableCameras] = useState<CameraParameters[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')

  useEffect(() => {
    getAvailableCameras()
  }, [])

  const getAvailableCameras = (): void => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const availableCameras: CameraParameters[] = []
        devices.map((device) => {
          if (device.kind === 'videoinput')
            availableCameras.push({ label: device.label, deviceId: device.deviceId })
        })
        setAvailableCameras(availableCameras)
        setSelectedCamera(availableCameras[0].deviceId)
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`)
      })
  }

  const handleChange = (event: SelectChangeEvent): void => {
    setSelectedCamera(event.target.value as string)
  }

  return (
    <Stack alignItems="center" mt={3}>
      <Typography variant="h2" mt={2}>
        Rozpocznij sesję
      </Typography>
      <Box mt={5}>
        {availableCameras.length == 0 ? (
          <>
            <Typography variant="h4">Nie wykryto kamery</Typography>
            <Button variant="outlined" onClick={getAvailableCameras} fullWidth sx={{ mt: 2 }}>
              Szukaj ponownie
            </Button>
          </>
        ) : (
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel id="choose-camera">Wybierz kamerę</InputLabel>
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
            <Button
              variant="outlined"
              onClick={(): void => startSession(selectedCamera)}
              disabled={selectedCamera === ''}
              autoFocus
            >
              Rozpocznij sesję Jogi
            </Button>
          </FormControl>
        )}
      </Box>
    </Stack>
  )
}

export default SessionCreatorPanel
