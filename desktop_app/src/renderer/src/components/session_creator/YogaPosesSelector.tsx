import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { AVAILABLE_POSES } from './types'

type Props = {
  selectedPoses: [[string, number]]
  setSelectedPoses: (selectedPoses: [[string, number]]) => void
}

function YogaPosesSelector({ selectedPoses, setSelectedPoses }: Props): JSX.Element {
  const handleChangePosition = (event: SelectChangeEvent): void => {
    const index = parseInt(event.target.name)
    const value = event.target.value as string

    if (value === '') {
      const tmp = selectedPoses
      tmp.splice(index, 1)
      setSelectedPoses([...tmp])
    } else {
      if (selectedPoses[index][0] === '') {
        const tmp = selectedPoses
        tmp[index][0] = value
        tmp.push(['', 30])
        setSelectedPoses([...tmp])
      } else {
        const tmp = selectedPoses
        tmp[index][0] = value
        setSelectedPoses([...tmp])
      }
    }
  }

  const handleChangeTime = (event: { target: { name: string; value: string } }): void => {
    const index = parseInt(event.target.name)
    const value = parseInt(event.target.value)

    if (value < 0 || value > 600) return

    const tmp = selectedPoses
    tmp[index][1] = value
    setSelectedPoses([...tmp])
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
        <MenuItem key={p.name} value={p.name} disabled={p.name == pose && true}>
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
          <Stack direction={'row'} mt={2}>
            <FormControl key={index} fullWidth>
              <InputLabel>Pozycja {index + 1}</InputLabel>
              <Select value={pose[0]} name={index.toString()} onChange={handleChangePosition}>
                {generateMenuItems(pose[0])}
              </Select>
            </FormControl>
            <Tooltip
              placement="top"
              title="Ustaw czas jaki chcesz spędzić w tej pozycji. (scrolla)"
              sx={{ maxWidth: '100px' }}
            >
              <TextField
                type="number"
                value={pose[1]}
                name={index.toString()}
                variant="outlined"
                inputProps={{
                  min: '0',
                  max: '600',
                  step: '5',
                  // shrink: true,
                  style: { textAlign: 'end' }
                }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">s</InputAdornment>
                }}
                onChange={handleChangeTime}
              />
            </Tooltip>
          </Stack>
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
