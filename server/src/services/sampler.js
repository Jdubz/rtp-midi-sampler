const {PythonShell} = require('python-shell')
const path = require('path')

const parseStatus = (int) => {
  const byte = int.toString(16);
  const channel = parseInt(byte[1], 16);
  const command = parseInt(byte[0], 16);
  return {
    channel,
    command,
  };
};

samplerOptions = {
  pythonPath: '/usr/bin/python3',
  pythonOptions: ['-u'],
  scriptPath: './src/sampler',
  args: ['../samples']
}

class Sampler {
  constructor(storage, socket) {
    this.socket = socket
    this.storage = storage
    this.pyshell = new PythonShell('sampler.py', samplerOptions);
    this.outputDevice = 1

    this.pyshell.on('message', async (message) => {
      let msg
      try {
        msg = JSON.parse(message)
      } catch(e) {
        console.warn('unparseable sampler message', e)
        console.log('sampler message:', message)
      }
      if (msg) await this.parseMessage(msg) 
    });

    this.pyshell.on('stderr', (err) => {
      try {
        const error = JSON.parse(err)
        console.error('sampler stderr:', error.tag, error.error)
      } catch(e) {
        console.log('sampler stderr:', err)
      }
    });

    this.pyshell.on('error', (err) => {
      console.error('sampler error:', err)
    })

    this.pyshell.on('close', () => {
      console.log('sampler closed')
    })

    this.pendingMessages = {}
  }

  parseMessage = async (msg) => {
    switch (msg.type) {
      case 'info':
        console.log('sampler info:', msg.tag, msg.message)
        break
      case 'response':
        this.pendingMessages[msg.id](msg.data)
        delete this.pendingMessages[msg.id]
        break
      case 'event':
        if (msg.event === 'ready') {
          await this.init(msg.data)
        }
        break
      default:
        console.warn('unknown sampler message type:', msg)
    }
  }

  init = async (data) => {
    const audioDevice = await this.storage.findOne('config', { config: 'audio output device' })
    if (audioDevice) {
      const audioDeviceIndex = data.audioDevices.findIndex((device) =>
        device.name === audioDevice.name
      )
      if (audioDeviceIndex >= 0) {
        await this.send('request', audioDeviceIndex, 'start_audio')
      } else {
        await this.storage.delete('config', { config: 'audio output device' })
      }
    }
    const channels = await this.storage.findOne('config', { config: 'channel map' })
    if (channels) {
      await this.send('request', channels.channels, 'loadSamples')
    } // else create channels config?
  }

  openOutput = async (device) => {
    const { index } = device
    const current = await this.storage.findOne('config', { config: 'audio output device' })
    if (current) {
      await this.storage.update('config', {
        config: 'audio output device'
      },{
        config: 'audio output device',
        name: device.name
      })
    } else {
      await this.storage.insert(
        'config',
        {
          config: 'audio output device',
          name: device.name
        },
      )
    }
    return await this.send('request', index, 'start_audio')
  }

  loadSamples = async (channels) => {
    return await this.send('request', channels, 'loadSamples')
  }

  loadChannel = async (channel, folder) => {
    return await this.send('request', { channel, folder }, 'loadChannel')
  }

  playFile = async (fileName) => {
    return await this.send('request', fileName, 'playFile')
  }

  getAudioDevices = async () => {
    return await this.send('request', 'get_audio_devices', 'getDevices')
  }

  getCurrentOutput = async () => {
    const audioDevice = await this.storage.findOne('config', { config: 'audio output device' })
    return audioDevice
  }

  sendMidi = (message) => {
    const parsedMsg = parseStatus(message[0])
    parsedMsg.note = message[1]
    parsedMsg.velocity = message[2]
    this.socket.send('midiMessage', parsedMsg)
    this.send('midi', parsedMsg)
  }

  send = async (type, message, id) => {
    this.pyshell.send(JSON.stringify({
      message,
      id,
      type,
    }))
    // TODO guarantee no id overwrites
    if (id) {
      return new Promise((resolve, reject) => {
        this.pendingMessages[id] = resolve
      })
    }
  }

  kill = () => {
    this.pyshell.kill();
  }
}

module.exports = Sampler
