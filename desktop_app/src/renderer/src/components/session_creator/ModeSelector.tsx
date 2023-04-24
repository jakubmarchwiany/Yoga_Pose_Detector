import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import YogaPosesSelector from './YogaPosesSelector'
import { getFetch } from '@renderer/utils/fetches'
import { Poses } from './types'

function ModeSelector(): JSX.Element {
  const [mode, setMode] = React.useState(false)
  const [availablePoses, setAvailablePoses] = React.useState<Poses[]>([])

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string): void => {
    setMode(Boolean(newAlignment))
  }

  useEffect(() => {
    getFetch<{ poses: Poses[] }>('/yoga_poses').then(({ poses }) => {
      setAvailablePoses(poses)
      console.log(poses)
    })
  }, [])

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

      {mode && availablePoses.length !== 0 && <YogaPosesSelector availablePoses={availablePoses} />}
    </Stack>
  )
}

export default ModeSelector
