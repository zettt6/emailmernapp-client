import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import React, { useState } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function ReceivedMessagesTable({ receivedMessages }) {
  const ExpandableTableRow = ({ children, expandComponent, ...props }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
      <>
        <TableRow {...props}>
          {children}
          <TableCell>
            <IconButton onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        {isExpanded && (
          <TableRow>
            <TableCell />
            {expandComponent}
          </TableRow>
        )}
      </>
    )
  }

  return (
    <Table
      sx={{
        minWidth: '650px',
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell align='center'>Sender</TableCell>
          <TableCell align='center'>Recipient</TableCell>
          <TableCell align='center'>Date</TableCell>
          <TableCell align='left'>Topic</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {receivedMessages.map((message) => (
          <ExpandableTableRow
            key={message._id}
            expandComponent={
              <TableCell align='center' colSpan='4'>
                {message.text}
              </TableCell>
            }
          >
            <TableCell align='center'>{message.sender}</TableCell>
            <TableCell align='center'> {message.recipient}</TableCell>
            <TableCell align='center'>
              {new Date(message.createdAt).toLocaleString('ru-RU')}
            </TableCell>
            <TableCell align='left'>{message.topic}</TableCell>
          </ExpandableTableRow>
        ))}
      </TableBody>
    </Table>
  )
}
