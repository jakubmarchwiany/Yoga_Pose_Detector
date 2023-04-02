import { Stack, Typography } from '@mui/material'
import Camera from './Camera'

function App(): JSX.Element {
  return (
    <Stack height="100vh" color={'text.primary'} bgcolor={'background.default'} alignItems="center">
      <Typography variant="h2" mt={2}>
        Joga helper
      </Typography>
      <Camera />
    </Stack>
  )
}

export default App
