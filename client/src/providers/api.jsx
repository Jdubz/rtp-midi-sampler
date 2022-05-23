import React, {useEffect, createContext, useState} from 'react';
import axios from 'axios';
import { serverUrl } from '../helpers/api';

export const ApiContext = createContext({
  files: [],
  audioDevices: [],
  midiDevices: [],
  currentOutput: '',
  channels: [],
  setChannel: () => {},
  openAudioDevice: () => {},
  openMidiDevice: () => {},
})

export default function ApiProvider({ children }) {
  const [files, setFiles] = useState([])
  const [channels, setChannels] = useState([])
  const [midiDevices, setMidiDevices] = useState([])
  const [audioDevices, setAudioDevices] = useState([])
  const [currentOutput, setCurrentOutput] = useState('')

  const getFiles = async () => {
    const url = serverUrl
    + '/samples';
    const filesResponse = await axios.get(url);
    return filesResponse.data
  }

  const getChannels = async () => {
    const url = serverUrl
    + '/midi/channels';
    const channels = await axios.get(url);
    return channels.data;
  }

  const setChannel = async (folder, i) => {
    const url = serverUrl
    + '/midi/channel';
    const channels = await axios.post(url, {
      folder,
      channel: i 
    });
    setChannels(channels.data)
  }

  const getAudioDevices = async () => {
    const devices = await axios.get(
      serverUrl
    + '/audio');
    return devices.data;
  }

  const getCurrentDevice = async () => {
    const url = serverUrl
    + '/audio/output'
    const device = await axios.get(url);
    return device.data.name;
  }

  const openAudioDevice = async (device, i) => {
    const url = serverUrl
    + '/audio/output';
    await axios.post(url, {
      ...device,
      index: i 
    });
    setCurrentOutput(device.name)
  }

  const getMidiDevices = async () => {
    const url = serverUrl
    + '/midi';
    const midiResponse = await axios.get(url);
    return midiResponse.data;
  }

  const openMidiDevice = async (i) => {
    const url = serverUrl
    + '/midi';
    const device = midiDevices[i]
    const midiResponse = await axios.post(url, device);
    const newDevice = midiResponse.data
    midiDevices[i] = newDevice
    setMidiDevices([ ...midiDevices ])
  }

  // TODO the consuming client should call the appropriate getData method
  const getData = async () => {
    const sampleFiles = await getFiles()
    const channelMap = await getChannels()
    const outputDevices = await getAudioDevices()
    const currentAudioDevice = await getCurrentDevice()
    const connectedMidiDevices = await getMidiDevices()
    setFiles(sampleFiles)
    setChannels(channelMap)
    setAudioDevices(outputDevices)
    setCurrentOutput(currentAudioDevice)
    setMidiDevices(connectedMidiDevices)
  }

  useEffect(() => {
    getData()
  }, [])

  return <ApiContext.Provider value={{
    files,
    audioDevices,
    midiDevices,
    currentOutput,
    channels,
    openMidiDevice,
    setChannel,
    openAudioDevice,
  }}>
    {children}
  </ApiContext.Provider>
}
