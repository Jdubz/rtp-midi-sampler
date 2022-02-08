const {PythonShell} = require('python-shell')

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
  args: ['1', '../samples']
}

class Sampler {
  constructor() {
    this.pyshell = new PythonShell('sampler.py', samplerOptions);

    this.pyshell.on('message', (message) => {
      try {
        const msg = JSON.parse(message)
        this.parseMessage(msg) 
      } catch(e) {
        console.warn('pyshell message', message)
      }
    });

    this.pyshell.on('stderr', (err) => {
      console.error('pyshell stderr: ', err)
    });

    this.pyshell.on('error', (err) => {
      console.error('pyshell error: ', err)
    })

    this.pyshell.on('close', () => {
      console.log('pyshell closed')
    })

    this.pendingMessages = {}
  }

  parseMessage = (msg) => {
    switch (msg.type) {
      case 'info':
        console.log('pyshell: ', msg.tag, msg.message)
        break
      case 'response':
        this.pendingMessages[msg.id](msg.data)
        delete this.pendingMessages[msg.id]
        break
      default:
        console.warn('unknown msg type', msg)
    }
  }

  sendMidi = (message) => {
    const parsedMsg = parseStatus(message[0])
    parsedMsg.note = message[1]
    parsedMsg.velocity = message[2]
    this.send('midi', parsedMsg)
  }

  kill = () => {
    this.pyshell.kill();
  }

  playFile = (fileName) => {
    return this.send('request', fileName, 'playFile')
  }

  send = async (type, message, id) => {
    this.pyshell.send(JSON.stringify({
      message,
      id,
      type,
    }))
    if (id) {
      return new Promise((resolve, reject) => {
        this.pendingMessages[id] = resolve
      })
    }
  }

  getAudioDevices = async () => {
    return this.send('request', 'get_audio_devices', 'getDevices')
  }
}

module.exports = Sampler
