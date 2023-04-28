import { Box, Divider, Typography } from '@mui/material'
import React from 'react'

type Props = {
  name: string
  propability: number
}

function YogaPose({ name, propability }: Props): JSX.Element {
  return (
    <>
      <Divider style={{ width: '100%' }} sx={{ mt: '2vh' }} />
      <Typography sx={{ typography: { xs: 'body1', md: 'h6', xl: 'h5' } }}>
        {name} - {propability}%
      </Typography>

      <Box
        component="img"
        alt="The house from the offer."
        src={`/src/components/yoga/images/${name}.jpg`}
        width={'50%'}
        height={'15vh'}
        sx={{ borderRadius: 5 }}
        mt={'1vh'}
      />
    </>
  )
}

export default YogaPose
