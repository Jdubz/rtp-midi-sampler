import { useEffect, useState } from 'react';
import axios from 'axios';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

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

  const openDevice = async (i) => {
    const url = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/midi';
    const device = devices[i]
    const midiResponse = await axios.post(url, device);
    const newDevice = midiResponse.data
    devices[i] = newDevice
    setDevices([ ...devices ])
  }

  return <List dense={true}>
    {devices.map((device, i) => 
      <ListItem key={i}>
        <ListItemButton onClick={() => openDevice(i)}>
          <ListItemText
            primary={device.name}
          />
          <ListItemIcon>
            {device.open
              ? <RadioButtonCheckedIcon />
              : <RadioButtonUncheckedIcon />
            }
            
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    )}
  </List>
}