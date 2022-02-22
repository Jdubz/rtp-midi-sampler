const { PythonShell } = require('python-shell');
const { parseStatus } = require('../midi/protocol');

const samplerOptions = {
  pythonPath: '/usr/bin/python3',
  pythonOptions: ['-u'],
  scriptPath: './src/services/sampler/sampler',
  args: ['../samples'],
};

class Sampler {
  constructor(storage, socket) {
    this.socket = socket;
    this.storage = storage;
    this.outputDevice = 1;
    this.pendingMessages = {};
    this.pyshell = new PythonShell('sampler.py', samplerOptions);
    this.eventListeners();
  }

  async eventListeners() {
    this.pyshell.on('message', async (message) => {
      let msg;
      try {
        msg = JSON.parse(message);
      } catch (e) {
        console.warn('unparseable sampler message', e);
        console.log('sampler message:', message);
      }
      if (msg) await this.parseMessage(msg);
    });

    this.pyshell.on('stderr', (err) => {
      try {
        const error = JSON.parse(err);
        console.error('sampler stderr:', error.tag, error.error);
      } catch (e) {
        console.log('sampler stderr:', err);
      }
    });

    this.pyshell.on('error', (err) => {
      console.error('sampler error:', err);
    });

    this.pyshell.on('close', (e) => {
      console.log('sampler closed, restarting', e);
      this.pyshell = new PythonShell('sampler.py', samplerOptions);
      this.eventListeners();
    });

    process.once('SIGUSR2', () => {
      this.kill();
    });
    process.on('exit', (code) => {
      console.log(`process exit, code: ${code}`);
      this.kill();
    });
  }

  async parseMessage(msg) {
    switch (msg.type) {
      case 'info':
        console.log('sampler info:', msg.tag, msg.message);
        break;
      case 'response':
        this.pendingMessages[msg.id](msg.data);
        delete this.pendingMessages[msg.id];
        break;
      case 'event':
        if (msg.event === 'ready') {
          await this.init(msg.data);
        }
        break;
      default:
        console.warn('unknown sampler message type:', msg);
    }
  }

  async init(data) {
    const audioDevice = await this.storage.findOne('config', { config: 'audio output device' });
    if (audioDevice) {
      const audioDeviceIndex = data.audioDevices.findIndex(
        (device) => device.name === audioDevice.name,
      );
      if (audioDeviceIndex >= 0) {
        await this.send('request', audioDeviceIndex, 'start_audio');
      } else {
        await this.storage.delete('config', { config: 'audio output device' });
      }
    }
    const channels = await this.storage.findOne('config', { config: 'channel map' });
    if (channels) {
      await this.send('request', channels.channels, 'loadSamples');
    } // else create channels config?
  }

  async openOutput(device) {
    const { index } = device;
    const current = await this.storage.findOne('config', { config: 'audio output device' });
    if (current) {
      await this.storage.update('config', {
        config: 'audio output device',
      }, {
        config: 'audio output device',
        name: device.name,
      });
    } else {
      await this.storage.insert(
        'config',
        {
          config: 'audio output device',
          name: device.name,
        },
      );
    }
    return this.send('request', index, 'start_audio');
  }

  async loadSamples(channels) {
    return this.send('request', channels, 'loadSamples');
  }

  async loadChannel(channel, folder) {
    return this.send('request', { channel, folder }, 'loadChannel');
  }

  async playFile(fileName) {
    return this.send('request', fileName, 'playFile');
  }

  async getAudioDevices() {
    return this.send('request', 'get_audio_devices', 'getDevices');
  }

  async getCurrentOutput() {
    const audioDevice = await this.storage.findOne('config', { config: 'audio output device' });
    return audioDevice;
  }

  sendMidi(message) {
    const parsedMsg = parseStatus(message[0]);
    parsedMsg.note = message[1];
    parsedMsg.velocity = message[2];
    this.socket.send('midiMessage', parsedMsg);
    this.send('midi', parsedMsg);
  }

  async send(type, message, id) {
    this.pyshell.send(JSON.stringify({
      message,
      id,
      type,
    }));
    // TODO guarantee no id overwrites
    return new Promise((resolve) => {
      if (id) {
        this.pendingMessages[id] = resolve;
      }
      resolve();
    });
  }

  kill() {
    this.pyshell.kill();
  }
}

module.exports = Sampler;
