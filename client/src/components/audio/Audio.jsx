import { useEffect, useState } from 'react';
import axios from 'axios';

import DeviceList from './DeviceList';

export default function Devices() {
  const [devices, setDevices] = useState([]);

  const getDevices = async () => {
    const devices = await axios.get(
      (process.env.NODE_ENV === 'development' ? process.env.REACT_APP_SERVER_URL : '')
    + '/audiodevice');
    setDevices(devices.data);
  }

  useEffect(() => {
    getDevices();
  }, [])

  return(
    <DeviceList devices={devices} />
  );
}