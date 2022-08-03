import { Button, Paper, TextField } from '@mui/material'
import React from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login({ username, setUsername }) {
  const navigate = useNavigate()

  async function loginUser() {
    try {
      localStorage.setItem('username', username)
      await axios.post(`/email/login`, {
        username,
      })
      setUsername(null)
      navigate('/email')
    } catch (err) {
      toast.error(err)
    }
  }
  return (
    <Paper
      elevation={15}
      sx={{
        padding: 3,
        height: 'max-content',
        width: 280,
        margin: '30px auto',
        borderTop: '10px solid #af52bf',
        borderRadius: '15px',
        boxShadow: '0px 0px 12px 1px rgb(0,0,0,0.4)',
      }}
    >
      <TextField
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ my: 1 }}
        label='Username'
        placeholder='Enter username'
        fullWidth
        required
      />
      <Button
        onClick={loginUser}
        color='primary'
        variant='contained'
        sx={{
          my: 2,
        }}
        fullWidth
      >
        Sign in
      </Button>
    </Paper>
  )
}
