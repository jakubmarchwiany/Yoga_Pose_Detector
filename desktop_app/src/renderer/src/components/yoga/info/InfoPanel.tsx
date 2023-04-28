/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import { SessionParams } from '@renderer/components/session_creator/types'
import { Info } from '../YogaSession'
import { useEffect, useState } from 'react'
import YogaPose from './YogaPose'

// import image_src from '../images/chair.jpg';
// const image_src = await import('../images/chair.jpg')

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
        <Typography sx={{ typography: { xs: 'h6', md: 'h5', xl: 'h4' } }} mt={'3vh'}>
          Wykrywane pozycje
        </Typography>

        <YogaPose name={info.poses[0][0]} propability={info.poses[0][1]} />
        <YogaPose name={info.poses[1][0]} propability={info.poses[1][1]} />
        <YogaPose name={info.poses[2][0]} propability={info.poses[2][1]} />

        <Divider style={{ width: '100%' }} sx={{ mt: '1vh' }} />

        <Typography sx={{ typography: { xs: 'body1', md: 'h6', xl: 'h5' } }}>
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
