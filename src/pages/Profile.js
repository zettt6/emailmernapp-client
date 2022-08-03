import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Grid, Paper } from '@mui/material'
import ReceivedMessagesTable from '../components/ReceivedMessagesTable'

export default function Profile({ setUsername, receivedMessages }) {
  const navigate = useNavigate()

  function goToEmail() {
    navigate('/email')
  }

  function logout() {
    localStorage.removeItem('username')
    setUsername(null)
    navigate('/')
  }

  return (
    <Grid align='center'>
      <Grid align='right'>
        <Button
          sx={{ p: 1.5, m: 1, bgcolor: 'background.paper' }}
          onClick={goToEmail}
        >
          send message
        </Button>
        <Button
          sx={{ p: 1.5, m: 1, bgcolor: 'background.paper' }}
          onClick={logout}
        >
          logout
        </Button>
      </Grid>
      <Grid>
        <Paper
          sx={{
            height: '60vh',
            width: '70vw',
            boxShadow: '0px 0px 12px 1px rgb(0,0,0,0.4)',
            my: 3,
            p: 1,
            overflowX: 'auto',
          }}
        >
          <ReceivedMessagesTable receivedMessages={receivedMessages} />
        </Paper>
      </Grid>
    </Grid>
  )
}
