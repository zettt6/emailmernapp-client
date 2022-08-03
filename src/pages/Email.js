import {
  Autocomplete,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Email({ username, setUsername }) {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [selectedUser, setSelectedUser] = useState('')
  const [topic, setTopic] = useState('')
  const [messageText, setMessageText] = useState('')
  const [sendedMessages, setSendedMessages] = useState([])

  useEffect(() => {
    searchUser()
  }, [inputValue])

  async function searchUser() {
    try {
      const response = await axios.get('/email/search', {
        params: {
          search: inputValue,
        },
      })
      setUsers(response.data)
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  async function sendMessage() {
    try {
      await axios.post(`/email/send`, {
        sender: username,
        topic,
        recipient: selectedUser,
        text: messageText,
      })
      getSendedMessages()
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  async function getSendedMessages() {
    try {
      const response = await axios.get('/email/sended', {
        params: {
          sender: username,
          recipient: selectedUser,
        },
      })
      setSendedMessages(response.data)
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  function goToProfilePage() {
    navigate('/profile')
  }

  function logout() {
    localStorage.removeItem('username')
    setUsername(null)
    navigate('/')
  }

  return (
    <Grid>
      <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          sx={{ p: 1.5, m: 1, bgcolor: 'background.paper' }}
          onClick={goToProfilePage}
        >
          profile
        </Button>
        <Button
          sx={{ p: 1.5, m: 1, bgcolor: 'background.paper' }}
          onClick={logout}
        >
          logout
        </Button>
      </Grid>
      <Paper
        elevation={15}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: 3,
          height: 'max-content',
          width: '50vw',
          margin: '30px auto',
          borderRadius: '15px',
          boxShadow: '0px 0px 12px 1px rgb(0,0,0,0.4)',
        }}
      >
        <Autocomplete
          disablePortal
          autoHighlight
          sx={{ width: '100%' }}
          options={users}
          getOptionLabel={(option) => {
            return option.username
          }}
          onChange={(event, value) => setSelectedUser(value.username)}
          onBlur={getSendedMessages}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder='To'
              onChange={({ target }) => {
                setInputValue(target.value)
              }}
              value={inputValue}
            />
          )}
        />
        {sendedMessages ? (
          <Table>
            <TableBody>
              {sendedMessages.map((message) => (
                <TableRow key={message._id}>
                  <TableCell>from: {message.sender}</TableCell>
                  <TableCell>to: {message.recipient}</TableCell>

                  <TableCell>
                    {new Date(message.createdAt).toLocaleString('ru-RU')}
                  </TableCell>
                  <TableCell>{message.topic}</TableCell>
                  <TableCell>{message.text}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          ''
        )}
        <TextField
          placeholder='Subject'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          sx={{ my: 1 }}
          fullWidth
          required
        />
        <TextField
          multiline
          sx={{ width: '100%' }}
          rows={5}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <Button
          onClick={sendMessage}
          color='primary'
          variant='contained'
          sx={{
            my: 2,
            width: '20%',
          }}
        >
          Send
        </Button>
      </Paper>
    </Grid>
  )
}
