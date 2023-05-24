import { FormControl, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import ModeSelector from './ModeSelector'
import { INFO_POSES } from './data'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw',
  height: '80vh',
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
  const [poseIndex, setPoseIndex] = useState('')
  const currentPose = INFO_POSES[poseIndex]

  const handleOpen = (): void => setOpen(true)
  const handleClose = (): void => setOpen(false)

  const handleChange = (event: SelectChangeEvent): void => {
    setPoseIndex(event.target.value as string)
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
            <>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <Select value={poseIndex} onChange={handleChange} displayEmpty>
                    {INFO_POSES.map((p, index) => {
                      return (
                        <MenuItem key={p.name} value={index}>
                          {p.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </Box>
              {currentPose && (
                <Stack direction={'row'}>
                  <Box width={'30%'}>
                    <Box
                      component="img"
                      src={`/src/components/yoga/images/${currentPose.image}.jpg`}
                      width={'100%'}
                      height={'40vh'}
                    />
                  </Box>

                  <Box width={'70%'} height={'90%'} overflow={'auto'} p={3}>
                    <Typography variant="h3" align="center">
                      {currentPose.name}
                    </Typography>
                    <Typography variant="h4" align="center">
                      Trudność: {currentPose.level}
                    </Typography>
                    <Typography variant="h4" align="center" mb={3}>
                      Zalecany czas: {currentPose.time}
                    </Typography>
                    {currentPose.describe &&
                      currentPose.describe.map((p, index) => {
                        return (
                          <Typography key={index + 'elo'} variant="body1" align="center">
                            {p}
                          </Typography>
                        )
                      })}
                  </Box>
                </Stack>
              )}
            </>
          )}
        </Box>
      </Modal>
    </Stack>
  )
}
