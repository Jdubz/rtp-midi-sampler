import { useEffect, useState } from 'react';
import axios from 'axios';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export default function Midi() {
  const [devices, setDevices] = useState([])

  useEffect(() => {
    getDevices()
  }, [])

  const getDevices = async () => {
    const url = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/midi';
    const midiResponse = await axios.get(url);
    setDevices(midiResponse.data);
  }

  return <List dense={true}>
    {devices.map((device, i) => 
      <ListItem key={i}>
        <ListItemText
          primary={device.name}
        />
      </ListItem>
    )}
  </List>
}