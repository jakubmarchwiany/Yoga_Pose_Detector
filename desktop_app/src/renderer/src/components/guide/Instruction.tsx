import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material'
import ModeSelector from './ModeSelector'
import { AVAILABLE_POSES } from '../session_creator/types'
import { INFO_POSES } from './data'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70vw',
  height: '70vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: '5%',
  //   p: 4,
  color: 'white'
  //   borderRadius: 5
}

export default function Instruction(): JSX.Element {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<string>('Instruction')
  const [pose, setPose] = useState('')

  console.log(pose)

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  const handleChange = (event: SelectChangeEvent): void => {
    setPose(event.target.value as string)
  }

  return (
    <Stack sx={{ color: 'white' }}>
      <Button size="large" onClick={handleOpen} fullWidth>
        Instrukcja
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModeSelector mode={mode} setMode={setMode} />
          {mode === 'Instruction' ? (
            <Typography variant="h3" align="center">
              Poradnik
            </Typography>
          ) : (
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <Select value={pose} onChange={handleChange} displayEmpty>
                  {INFO_POSES.map((p) => {
                    return (
                      <MenuItem key={p.name} value={p.image}>
                        {p.name}
                      </MenuItem>
                    )
                  })}
                </Select>
                <Box
                  component="img"
                  src={`/src/components/yoga/images/${pose}.jpg`}
                  width={'50%'}
                  height={'25vh'}
                />
              </FormControl>
            </Box>
          )}
        </Box>
      </Modal>
    </Stack>
  )
}
