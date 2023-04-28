import { Unstable_Grid2 as Grid } from '@mui/material'
import { useState } from 'react'
import SessionCreatorPanel from './session_creator/SessionCreatorPanel'
import YogaSession from './yoga/YogaSession'
import { SessionParams } from './session_creator/types'

function App(): JSX.Element {
  const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false)
  const [sessionParams, setSessionParams] = useState<SessionParams>()

  const startSession = (sessionParams: SessionParams): void => {
    console.log(sessionParams)
    setSessionParams(sessionParams)
    setIsSessionStarted(true)
  }

  const restartSession = (): void => {
    setIsSessionStarted(false)
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
        <YogaSession restartSession={restartSession} sessionParams={sessionParams!} />
      ) : (
        <Grid xs={12}>
          <SessionCreatorPanel startSession={startSession} />
        </Grid>
      )}
    </Grid>
  )
}

export default App
