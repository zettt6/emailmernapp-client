import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ProtectedRoute } from './outlets/ProtectedRoute'
import axios from 'axios'
import { Box, Button, Paper, Typography } from '@mui/material'
import AuthLayout from './AuthLayout'
import Login from './pages/Login'
import Email from './pages/Email'
import Profile from './pages/Profile'

const theme = createTheme({
  typography: {
    fontFamily: ['Lato', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#af52bf',
      contrastText: '#fff',
    },
    secondary: {
      main: '#af52bf',
    },
  },
})

function App() {
  const [username, setUsername] = useState('')
  const [receivedMessages, setReceivedMessages] = useState([])
  const [loaded, setLoaded] = useState(false)

  const storedUser = localStorage.getItem('username')

  useEffect(() => {
    if (storedUser) {
      setUsername(storedUser)
    }
  }, [storedUser, username])

  const getReceivedMessages = useCallback(async () => {
    try {
      const response = await axios.get(`/email/received`, {
        params: {
          username,
        },
      })
      if (loaded && response.data.length !== receivedMessages.length) {
        const newMessages = [...response.data].splice(receivedMessages.length)
        newMessages.forEach((newMessage) => {
          toast.custom((t) => customToast(t, newMessage))
        })
      }
      setReceivedMessages(response.data)
      if (!loaded) setLoaded(true)
    } catch (err) {
      console.log(err)
    }
  }, [username, receivedMessages, loaded, setLoaded])

  const customToast = (t, newMessage) => {
    return (
      <Paper
        sx={{
          padding: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 'max-content',
          width: '15vw',
          borderRadius: '5px',
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 'bold' }}>
            {newMessage.sender}
          </Typography>
          <Typography>{newMessage.text}</Typography>
        </Box>

        <Button onClick={() => toast.dismiss(t._id)}>Close</Button>
      </Paper>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Toaster
        position='bottom-right'
        containerStyle={{ fontFamily: 'Lato' }}
        reverseOrder={true}
      />
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path='/'
            element={
              <ProtectedRoute isAllowed={!storedUser} redirectPath='/email'>
                <Login username={username} setUsername={setUsername} />
              </ProtectedRoute>
            }
          />
          <Route
            element={
              <AuthLayout
                getReceivedMessages={getReceivedMessages}
                receivedMessages={receivedMessages}
              />
            }
          >
            <Route
              exact
              path='/email'
              element={
                <ProtectedRoute isAllowed={!!storedUser} redirectPath='/'>
                  <Email username={username} setUsername={setUsername} />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path='/profile'
              element={
                <ProtectedRoute isAllowed={!!storedUser} redirectPath='/'>
                  <Profile
                    username={username}
                    setUsername={setUsername}
                    receivedMessages={receivedMessages}
                  />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
