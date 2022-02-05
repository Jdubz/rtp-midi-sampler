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
  args: ['2', '../samples']
}

class Sampler {
  constructor() {
    this.pyshell = new PythonShell('sampler.py', samplerOptions);

    this.pyshell.on('message', (message) => {
      console.log('pyshell message: ', message)
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

    this.send = this.send.bind(this)
    this.kill = this.kill.bind(this)
  }

  send(message) {
    const parsedMsg = parseStatus(message[0])
    parsedMsg.note = message[1]
    parsedMsg.velocity = message[2]
    console.log('sending msg: ', parsedMsg)
    this.pyshell.send(JSON.stringify(parsedMsg))
  }

  kill() {
    this.pyshell.kill();
  }
}

module.exports = Sampler
