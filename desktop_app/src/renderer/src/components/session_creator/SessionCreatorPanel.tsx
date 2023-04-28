import {
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import ModeSelector from './ModeSelector'
import YogaPosesSelector from './YogaPosesSelector'
import { AVAILABLE_POSES, CameraParameters, SessionParams } from './types'

type Params = {
  startSession: (sesionParams: SessionParams) => void
}

function SessionCreatorPanel({ startSession }: Params): JSX.Element {
  const [mode, setMode] = useState<string>('Pose_detection')
  const [availableCameras, setAvailableCameras] = useState<CameraParameters[]>([])
  const [selectedPoses, setSelectedPoses] = useState<[[string, number]]>([['', 30]])
  const [selectedCamera, setSelectedCamera] = useState<string>('')

  useEffect(() => {
    getAvailableCameras()
  }, [])

  const prepareToStartSession = (): void => {
    const selectedPosesCopy = [...selectedPoses]
    selectedPosesCopy.pop()
    const preparedPoses = selectedPosesCopy!.map((pose) => {
      console.log(pose[0])
      for (let index = 0; index < AVAILABLE_POSES.length; index++) {
        if (pose[0] === AVAILABLE_POSES[index].name)
          return [pose[0], pose[1], AVAILABLE_POSES[index].value]
      }
    }) as [[string, number, number]]

    const sessionParams = {
      mode: mode,
      Poses: preparedPoses,
      camera: selectedCamera
    }
    startSession(sessionParams)
  }

  const getAvailableCameras = (): void => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const availableCameras: CameraParameters[] = []
        // console.log(devices)
        devices.map((device) => {
          if (device.kind === 'videoinput')
            availableCameras.push({ label: device.label, deviceId: device.deviceId })
        })
        // console.log(availableCameras)
        setAvailableCameras(availableCameras)
        // console.log(availableCameras[0])
        if (availableCameras.length > 0) setSelectedCamera(availableCameras[0].deviceId)
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`)
      })
  }

  const handleChange = (event: SelectChangeEvent): void => {
    setSelectedCamera(event.target.value as string)
  }
  return (
    <Container
      component="main"
      sx={{
        px: { xs: 0, sm: 10, md: 5, lg: 30, xl: 40 },
        py: { xs: 0, sm: 1, md: 2, lg: 3, xl: 5 }
      }}
    >
      <Stack alignItems="center">
        <Typography variant="h2" mt={2}>
          Rozpocznij sesję
        </Typography>

        {availableCameras.length == 0 ? (
          <>
            <Typography variant="h4">Nie wykryto kamery</Typography>
            <Button variant="outlined" onClick={getAvailableCameras} fullWidth sx={{ mt: 2 }}>
              Szukaj ponownie
            </Button>
          </>
        ) : (
          <>
            <ModeSelector mode={mode} setMode={setMode} />
            {mode == 'Yoga_session' && (
              <YogaPosesSelector
                selectedPoses={selectedPoses}
                setSelectedPoses={setSelectedPoses}
              />
            )}
            <FormControl sx={{ mt: 3 }}>
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
                onClick={prepareToStartSession}
                disabled={
                  selectedCamera === '' || (mode === 'Yoga_session' && selectedPoses.length == 1)
                }
                autoFocus
              >
                Rozpocznij sesję Jogi
              </Button>
            </FormControl>
          </>
        )}
      </Stack>
    </Container>
  )
}

export default SessionCreatorPanel
