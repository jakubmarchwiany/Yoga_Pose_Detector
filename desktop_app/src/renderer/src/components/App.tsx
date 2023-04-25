import { Unstable_Grid2 as Grid } from '@mui/material'
import { useState } from 'react'
import SessionCreatorPanel from './session_creator/SessionCreatorPanel'
import YogaSession from './yoga/YogaSession'

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
      flex={1}
      overflow={'auto'}
      height="100vh"
      width="100vw"
      color={'text.primary'}
      bgcolor={'background.default'}
    >
      {isSessionStarted ? (
        <YogaSession restartSession={restartSession} selectedCamera={selectedCamera} />
      ) : (
        <Grid xs={12}>
          <SessionCreatorPanel startSession={startSession} />
        </Grid>
      )}
    </Grid>
  )
}

export default App
