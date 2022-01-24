import { useEffect, useState } from 'react';
import axios from 'axios';

import DeviceList from './DeviceList';

export default function Devices() {
  const [devices, setDevices] = useState([]);

  const getDevices = async () => {
    const devices = await axios.get('http://192.168.86.25:8080/audiodevice');
    setDevices(devices.data);
  }

  useEffect(() => {
    getDevices();
  }, [])

  return(
    <DeviceList devices={devices} />
  );
}