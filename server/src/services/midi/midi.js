const midi = require('midi');

class Midi {
  constructor(callback, storage, sampler) {
    this.sampler = sampler;
    this.messageCallback = callback;
    this.storage = storage;
    this.inputs = {};
  }

  async initDevice(device, savedDevices) {
    // TODO midi devices default to open
    if (savedDevices[device.name] && savedDevices[device.name].open) {
      this.openInput(device.index);
      console.log('Opened midi device ', device.name);
    }
    if (!savedDevices[device.name]) {
      const saveDevice = { ...device };
      delete saveDevice.index;
      await this.storage.insert('midiDevice', saveDevice);
    }
  }

  async init() {
    const savedDevices = await this.loadDevices();
    const connectedDevices = this.getConnectedDevices();
    const initList = connectedDevices.map(
      (device) => async () => this.initDevice(device, savedDevices),
    );
    await Promise.all(initList);
    await this.getChannels();
  }

  async openInput(deviceId) {
    const input = new midi.Input();
    input.on('message', (deltaTime, message) => {
      this.messageCallback(message);
    });
    input.openPort(deviceId);
    this.inputs[deviceId] = input;
  }

  closeInput(deviceId) {
    const input = this.inputs[deviceId];
    input.closePort();
    delete this.inputs[deviceId];
  }

  async loadDevices() {
    const deviceData = await this.storage.find('midiDevice', {});
    const devices = deviceData.reduce((reducer, device) => {
      const newReducer = { ...reducer };
      newReducer[device.name] = device;
      return newReducer;
    }, {});
    return devices;
  }

  getConnectedDevices() {
    const input = new midi.Input();
    const numPorts = input.getPortCount();
    const ports = [];
    for (let i = 0; i < numPorts; i += 1) {
      const name = input.getPortName(i);
      ports.push({ index: i, name });
    }
    return ports;
  }

  async getDevices() {
    const savedDevices = await this.loadDevices();
    const connectedDevices = await this.getConnectedDevices();
    return connectedDevices.map((device) => ({
      ...device,
      ...savedDevices[device.name],
    }));
  }

  async getChannels() {
    const channelsConfig = await this.storage.findOne('config', { config: 'channel map' });
    if (channelsConfig) {
      return channelsConfig.channels;
    }
    const channels = [...new Array(16).keys()].map(() => null);
    await this.storage.insert('config', {
      config: 'channel map',
      channels,
    });
    return channels;
  }

  async updateChannel(index, value) {
    const channelsConfig = await this.storage.findOne('config', { config: 'channel map' });
    let newChannels;
    if (channelsConfig) {
      newChannels = [...channelsConfig.channels];
      newChannels[index] = value;
      await this.storage.update('config', { config: 'channel map' }, {
        config: 'channel map',
        channels: newChannels,
      });
    } else {
      newChannels = new Array(16);
      newChannels[index] = value;
      await this.storage.insert(
        'config',
        {
          config: 'channel map',
          channels: newChannels,
        },
      );
    }
    await this.sampler.loadChannel(index, value);
    return newChannels;
  }

  async togglePort(device) {
    if (device.open) {
      this.closeInput(device.index);
    } else {
      this.openInput(device.index);
    }
    const newDevice = { ...device, open: !device.open };
    delete newDevice.index;
    const numRows = await this.storage.update('midiDevice', { name: device.name }, newDevice);
    console.log(numRows);
    if (!numRows) throw new Error('no midi device of name ', device.name);
    return { ...device, open: !device.open };
  }
}

module.exports = Midi;
