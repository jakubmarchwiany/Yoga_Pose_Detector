import { Box, Button, Stack, Typography } from '@mui/material'

type Props = {
  restartSession: () => void
}

function InfoPanel({ restartSession }: Props): JSX.Element {
  return (
    <Stack height="100%" width="100%" alignItems="center">
      <Typography variant="h3" mt={3}>
        Pozycja
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

export default InfoPanel
