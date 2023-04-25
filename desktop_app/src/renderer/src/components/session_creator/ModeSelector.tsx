import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React from 'react'
import YogaPosesSelector from './YogaPosesSelector'

function ModeSelector(): JSX.Element {
  const [mode, setMode] = React.useState(false)

  const handleChange = (_event: React.MouseEvent<HTMLElement>, newAlignment: string): void => {
    setMode(Boolean(newAlignment))
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
        <ToggleButton value={false}>Wykrywanie pozycji</ToggleButton>
        <ToggleButton value={true}>Sesja Yogi</ToggleButton>
      </ToggleButtonGroup>

      {mode && <YogaPosesSelector />}
    </Stack>
  )
}

export default ModeSelector
