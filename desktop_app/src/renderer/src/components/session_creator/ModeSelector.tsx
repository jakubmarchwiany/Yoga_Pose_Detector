import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React from 'react'

type Props = {
  mode: string
  setMode: (mode: string) => void
}

function ModeSelector({ mode, setMode }: Props): JSX.Element {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: string): void => {
    if (newAlignment !== null) {
      setMode(newAlignment)
    }
  }

  return (
    <Stack alignItems="center" sx={{ width: '100%' }}>
      <Typography variant="h5">Wybierz tryb</Typography>

      <ToggleButtonGroup
        color="primary"
        value={mode}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        sx={{ mt: 1 }}
      >
        <ToggleButton value={'Pose_detection'}>Wykrywanie pozycji</ToggleButton>
        <ToggleButton value={'Yoga_session'}>Sesja Yogi</ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

export default ModeSelector
