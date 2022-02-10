const midi = require('midi');

class Midi {
  constructor(callback, storage) {
    this.storage = storage
    this.input = new midi.Input();
    this.portMap = {};

    this.input.on('message', (deltaTime, message) => {
      callback(message);
    });
  }

  init = async () => {
    const savedDevices = await this.loadDevices()
    const connectedDevices = this.getConnectedDevices()
    // TODO midi devices default to open
    for (const i in connectedDevices) {
      const device = connectedDevices[i]
      if (savedDevices[device.name] && savedDevices[device.name].open) {
        this.input.openPort(device.index);
        console.log('Opened midi device ', device.name)
      }
      if (!savedDevices[device.name]) {
        delete device.index
        await this.storage.insert('midiDevice', device)
      }
    }
    await this.getChannels()
  }

  loadDevices = async () => {
    const deviceData = await this.storage.find('midiDevice', {})
    const devices = deviceData.reduce((reducer, device) => {
      reducer[device.name] = device
      return reducer
    }, {})
    return devices
  }

  getConnectedDevices = () => {
    const numPorts = this.input.getPortCount();
    const ports = [];
    for (let i = 0; i < numPorts; i++) {
      const name = this.input.getPortName(i)
      ports.push({ index: i, name });
    }
    return ports;
  }

  getDevices = async () => {
    const savedDevices = await this.loadDevices()
    const connectedDevices = await this.getConnectedDevices()
    return connectedDevices.map(device => {
      return {
        ...device,
        ...savedDevices[device.name]
      }
    })
  }

  getChannels = async () => {
    const channelsConfig = await this.storage.findOne('config', { config: 'channel map' })
    if (channelsConfig) {
      return channelsConfig.channels
    } else {
      const channels = [...new Array(16).keys()].map(() => null)
      await this.storage.insert('config', { 
        config: 'channel map',
        channels
      })
      return channels
    }
  }

  updateChannel = async (index, value) => {
    const channelsConfig = await this.storage.findOne('config', { config: 'channel map' })
    if (channelsConfig) {
      const newChannels = [ ...channelsConfig.channels ]
      newChannels[index] = value
      await this.storage.update('config', { config: 'channel map' }, {
        config: 'channel map',
        channels: newChannels
      })
      return newChannels
    } else {
      const newChannels = new Array(16)
      newChannels[index] = value
      await this.storage.insert('config',
      {
        config: 'channel map',
        channels: newChannels
      })
      return newChannels
    }
  }

  openPort = async (device) => {
    if (device.open) {
      this.input.closePort(device.index)
    } else {
      this.input.openPort(device.index)
    }
    const newDevice = { ...device, open: !device.open }
    delete newDevice.index
    const numRows = await this.storage.update('midiDevice', { name: device.name }, newDevice)
    if (!numRows) throw new Error('no midi device of name ', device.name)
    return { ...device, open: !device.open }
  }
}

module.exports = Midi;
