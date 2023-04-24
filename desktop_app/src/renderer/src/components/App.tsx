import { Unstable_Grid2 as Grid } from '@mui/material'
import { useState } from 'react'
import CameraPanel from './camera/CameraPanel'
import InfoPanel from './info/InfoPanel'
import SessionCreatorPanel from './session_creator/SessionCreatorPanel'

function App(): JSX.Element {
  const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false)
  const [selectedCamera, setSelectedCamera] = useState<string>('')

  const startSession = (cameraId: string): void => {
    setSelectedCamera(cameraId)
    setIsSessionStarted(true)
  }

  const restartSession = (): void => {
    setIsSessionStarted(false)
    setSelectedCamera('')
  }

  return (
    <Grid
      container
      // flex={1}
      overflow={'auto'}
      height="100vh"
      width="100vw"
      color={'text.primary'}
      bgcolor={'background.default'}
    >
      {isSessionStarted ? (
        <>
          <Grid xs={9}>
            <CameraPanel cameraId={selectedCamera} />
          </Grid>
          <Grid xs={3}>
            <InfoPanel restartSession={restartSession} />
          </Grid>
        </>
      ) : (
        <Grid xs={12}>
          <SessionCreatorPanel startSession={startSession} />
        </Grid>
      )}
    </Grid>
  )
}

export default App
