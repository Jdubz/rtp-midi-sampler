import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { serverUrl } from '../../helpers/api'

export default function MidiStream({ isOpen }) {
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const newSocket = io(serverUrl)
      newSocket.on('midiMessage', addMessage)
      setSocket(newSocket)
    } else if (!isOpen && socket) {
      socket.close()
      setSocket(null)
    }
    return () => {
      if (socket) socket.close()
    }
  }, [isOpen])

  const addMessage = (message) => {
    setMessages((currentMessages) => [ message, ...currentMessages ])
  }

  return <TableContainer>
    <Table sx={{ width: '100%' }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Channel</TableCell>
          <TableCell>Command</TableCell>
          <TableCell>Note</TableCell>
          <TableCell>Velocity</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {messages.map((message, i) => 
          <TableRow
            key={i}
          >
            <TableCell>{message.channel}</TableCell>
            <TableCell>{message.command}</TableCell>
            <TableCell>{message.note}</TableCell>
            <TableCell>{message.velocity}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
}
