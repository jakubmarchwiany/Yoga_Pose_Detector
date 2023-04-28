import { createTheme, responsiveFontSizes } from '@mui/material'

export const theme = responsiveFontSizes(
  createTheme({
    palette: {
      // palette values for light mode
      primary: {
        main: '#7aeb34',
        contrastText: '#fff'
      },
      secondary: {
        main: '#fff',
        contrastText: '#fff'
      },
      background: {
        default: '#303030',
        paper: '#424242'
      },
      divider: '#D3D3D3',
      text: {
        primary: '#fff',
        secondary: '#fff'
      }
    },
    typography: {
      fontFamily: ['Montserrat', 'sans-serif'].join(',')
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 769,
        md: 1024,
        lg: 1216,
        xl: 1408
      }
    }
  })
)
