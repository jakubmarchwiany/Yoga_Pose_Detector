import { Button, Stack, Typography } from '@mui/material'
import { SessionParams } from '@renderer/components/session_creator/types'
import { Info } from '../YogaSession'

type Props = {
  info: Info
  sessionParams: SessionParams
  restartSession: () => void
}

function InfoPanel({ info, sessionParams, restartSession }: Props): JSX.Element {
  const { mode, Poses } = sessionParams

  if (mode === 'Pose_detection' && info) {
    return (
      <Stack height="100%" width="100%" alignItems="center">
        <Typography variant="h5" mt={1}>
          Wykrywane pozycje
        </Typography>

        <Typography variant="h4" mt={3}>
          {info.poses[0]}
        </Typography>

        <Typography variant="h5" mt={2}>
          {info.poses[1]}
        </Typography>

        <Typography variant="h6" mt={3}>
          {info.poses[2]}
        </Typography>

        <Typography variant="h6" mt={3}>
          Wykryta liczba puntków: {info.pointsDetected}
        </Typography>

        <Button fullWidth sx={{ mt: 'auto' }} onClick={restartSession}>
          Restart
        </Button>
      </Stack>
    )
  } else {
    return (
      <Stack height="100%" width="100%" alignItems="center">
        <Typography variant="h5" mt={1}>
          Wykrywane pozycje
        </Typography>

        <Typography variant="h6" mt={2}>
          Kwiat lotosu
        </Typography>

        <Typography variant="h5" mt={3}>
          Wskazówki:
        </Typography>

        <Button fullWidth sx={{ mt: 'auto' }} onClick={restartSession}>
          Restart
        </Button>
      </Stack>
    )
  }
}

export default InfoPanel
