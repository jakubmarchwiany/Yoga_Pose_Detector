/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Divider, Stack, Typography } from '@mui/material'
import { SessionParams } from '@renderer/components/session_creator/types'
import YogaPose from './YogaPose'

type Props = {
  round: number
  poseCorrent: boolean
  pointsDetected: number
  posesDetected: [string, number][]
  poseTimeLeft: number
  sessionParams: SessionParams
  restartSession: () => void
}

function InfoPanel({
  round,
  poseCorrent,
  poseTimeLeft,
  pointsDetected,
  posesDetected,
  sessionParams,
  restartSession
}: Props): JSX.Element {
  const { mode, Poses } = sessionParams

  if (mode === 'Pose_detection') {
    return (
      <Stack height="100%" width="100%" alignItems="center">
        {posesDetected.length > 0 && (
          <>
            <YogaPose name={posesDetected[0][0]} propability={posesDetected[0][1]} />
            <YogaPose name={posesDetected[1][0]} propability={posesDetected[1][1]} />
            <YogaPose name={posesDetected[2][0]} propability={posesDetected[2][1]} />
          </>
        )}
        {pointsDetected < 14 ? (
          <Typography variant="h4" mt={1} mb={3}>
            Za mało wykrych punktów
          </Typography>
        ) : (
          <Typography mt={1.5} sx={{ typography: { xs: 'body1', md: 'h6', xl: 'h5' } }}>
            Wykryta liczba puntków: {pointsDetected}
          </Typography>
        )}

        <Button fullWidth sx={{ mt: 'auto' }} onClick={restartSession}>
          Restart
        </Button>
      </Stack>
    )
  } else {
    return (
      <Stack height="100%" width="100%" alignItems="center">
        <Typography variant="h3" mt={1}>
          Pozycja {round + 1}
        </Typography>
        {round + 1 === Poses.length ? (
          <Typography variant="h4">Ostatnia Pozycja</Typography>
        ) : (
          <Typography variant="h4" mt={1} mb={3}>
            Następna pozycja: {Poses[round + 1][0]}
          </Typography>
        )}
        <YogaPose name={Poses[round][0]} />
        <Typography variant="h1" mt={1} color={poseCorrent ? 'green' : 'white'}>
          {poseTimeLeft}
        </Typography>
        {pointsDetected < 14 ? (
          <Typography variant="h4" mt={1} mb={3}>
            Za mało wykrych punktów
          </Typography>
        ) : (
          <Typography mt={1.5} sx={{ typography: { xs: 'body1', md: 'h6', xl: 'h5' } }}>
            Wykryta liczba puntków: {pointsDetected}
          </Typography>
        )}
        <Button fullWidth sx={{ mt: 'auto' }} onClick={restartSession}>
          Restart
        </Button>
      </Stack>
    )
  }
}

export default InfoPanel
