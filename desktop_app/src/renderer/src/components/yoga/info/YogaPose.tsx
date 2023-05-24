import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'

type Props = {
  name: string
  withText?: boolean
  propability?: number
}

function YogaPose({ name, propability, withText = true }: Props): JSX.Element {
  return (
    <>
      {propability! >= 0.9 && (
        <Stack height={'25vh'} width={'100%'}>
          <Box
            component="img"
            alt="The house from the offer."
            src={`/src/components/yoga/images/${name}.jpg`}
            width={'100%'}
            height={'25vh'}
          />

          {propability && withText && (
            <>
              <Typography
                sx={{
                  color: 'black',
                  position: 'absolute',
                  typography: { xs: 'h4', md: 'h3', xl: 'h2' }

                  // top: '8px',
                  // bottom: '8px',
                  // left: '16px'
                }}
              >
                {name}
              </Typography>
              <Typography
                sx={{
                  color: 'black',
                  position: 'absolute',
                  typography: { xs: 'h4', md: 'h3', xl: 'h2' },
                  marginTop: '5vh'
                  // top: '8px',
                  // bottom: '8px',
                  // left: '16px'
                }}
              >
                {(propability * 100).toFixed(2)}%
              </Typography>
            </>
          )}
        </Stack>
      )}
    </>
  )
}

export default YogaPose
