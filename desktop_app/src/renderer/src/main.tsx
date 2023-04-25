import { ThemeProvider } from '@mui/material'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/app.css'
import { theme } from './assets/theme'
import App from './components/App'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    <Toaster
      position="bottom-center"
      gutter={10}
      containerStyle={{ marginBottom: '40px' }}
      toastOptions={{
        style: {
          background: theme.palette.background.default,
          color: theme.palette.text.secondary,
          minWidth: '250px'
        }
      }}
    />
  </>
)
