import { Unstable_Grid2 as Grid } from '@mui/material'
import { useState } from 'react'
import CameraPanel from './camera/CameraPanel'
import InfoPanel from './info/InfoPanel'
import SessionCreatorPanel from './session_creator/SessionCreatorPanel'

function App(): JSX.Element {
  const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false)

  return (
    <Grid
      height="100vh"
      width="100vw"
      container
      color={'text.primary'}
      bgcolor={'background.default'}
    >
      {isSessionStarted ? (
        <>
          <Grid xs={8}>
            <CameraPanel />
          </Grid>
          <Grid xs={4}>
            <InfoPanel />
          </Grid>
        </>
      ) : (
        <Grid xs={12}>
          <SessionCreatorPanel />
        </Grid>
      )}
    </Grid>
  )
}

export default App
