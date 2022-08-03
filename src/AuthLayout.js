import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout({ getReceivedMessages }) {
  useEffect(() => {
    const receiveMessagesInterval = setInterval(() => {
      getReceivedMessages()
    }, 5000)
    return () => clearInterval(receiveMessagesInterval)
  }, [getReceivedMessages])

  return <Outlet />
}
