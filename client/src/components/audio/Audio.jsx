import { useEffect, useState } from 'react';
import axios from 'axios';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import DeviceList from './DeviceList';

export default function Devices() {
  const [devices, setDevices] = useState([]);

  const getDevices = async () => {
    const devices = await axios.get('http://192.168.86.250:8080/audiodevice');
    setDevices(devices.data);
  }

  useEffect(() => {
    getDevices();
  }, [])

  return(
    <Paper elevation={2} sx={{ padding: '1rem' }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Audio Devices
      </Typography>
      <DeviceList devices={devices} />
    </Paper>
  );
}