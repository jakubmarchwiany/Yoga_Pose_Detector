import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import React from 'react'
import { AVAILABLE_POSES } from './types'

function YogaPosesSelector(): JSX.Element {
  const [selectedPoses, setSelectedPoses] = React.useState<[[string, number]]>([['', 0]])

  const handleChange = (event: SelectChangeEvent): void => {
    const index = parseInt(event.target.name)
    const value = event.target.value as string

    if (value === '') {
      const tmp = selectedPoses
      tmp.splice(index, 1)
      setSelectedPoses([...tmp])
    } else {
      if (selectedPoses[index][0] === '') {
        const tmp = selectedPoses
        tmp[index] = [value, 0]
        tmp.push(['', 0])
        setSelectedPoses([...tmp])
      } else {
        const tmp = selectedPoses
        tmp[index] = [value, 0]
        setSelectedPoses([...tmp])
      }
    }
  }

  const generateMenuItems = (pose: string): JSX.Element[] => {
    const menuItems: JSX.Element[] = []

    if (pose !== '')
      menuItems.push(
        <MenuItem key={''} value={''} dense={true}>
          {'Usuń'}
        </MenuItem>
      )

    AVAILABLE_POSES.forEach((p) => {
      menuItems.push(
        <MenuItem key={p.name} value={p.name} dense={true} disabled={p.name == pose && true}>
          {p.name}
        </MenuItem>
      )
    })

    return menuItems
  }

  const generateSelectors = (): JSX.Element[] => {
    const selectors: JSX.Element[] = []

    selectedPoses.forEach((pose, index) => {
      selectors.push(
        <Grid xs={12} md={6} key={index} alignItems="center">
          <FormControl key={index} sx={{ mt: 2 }} fullWidth>
            <InputLabel>Pozycja {index + 1}</InputLabel>
            <Select value={pose[0]} name={index.toString()} onChange={handleChange}>
              {generateMenuItems(pose[0])}
            </Select>
          </FormControl>
        </Grid>
      )
    })
    return selectors
  }

  return (
    <Stack alignItems="center" sx={{ width: '100%' }}>
      <Typography variant="h5" mt={2}>
        Wybierz pozycje
      </Typography>
      <Grid flex={1} container spacing={1} width="100%" justifyContent={'center'}>
        {generateSelectors()}
      </Grid>
    </Stack>
  )
}

export default YogaPosesSelector
