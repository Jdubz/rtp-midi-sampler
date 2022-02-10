import { useEffect, useState } from 'react';
import axios from 'axios';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [output, setOutput] = useState('');

  const getDevices = async () => {
    const devices = await axios.get(
      (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/audio');
    setDevices(devices.data);
  }

  const getCurrentDevice = async () => {
    const device = await axios.get(
      (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/audio/output');
    setOutput(device.data.name);
  }

  const openDevice = async (device, i) => {
    const url = (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/audio/output';
    await axios.post(url, {
      ...device,
      index: i 
    });
    setOutput(device.name)
  }

  useEffect(() => {
    getDevices();
    getCurrentDevice();
  }, [])

  return <List dense={true}>
    {devices.map((device, i) => 
      <ListItem key={i}>
        <ListItemButton onClick={() => openDevice(device, i)}>
          <ListItemText
            primary={device.name}
          />
          <ListItemIcon>
            {device.name === output
              ? <RadioButtonCheckedIcon />
              : <RadioButtonUncheckedIcon />
            }
            
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    )}
  </List>
}