const midi = require('midi');

class Midi {
  constructor(callback) {
    this.input = new midi.Input();
    this.portMap = {};

    this.input.on('message', (deltaTime, message) => {
      // The message is an array of numbers corresponding to the MIDI bytes:
      //   [status, data1, data2]
      // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
      // information interpreting the messages.
      callback(message);
    });
    this.openPort = this.openPort.bind(this);
    this.getDevices = this.getDevices.bind(this);
  }

  getDevices() {
    const numPorts = this.input.getPortCount();
    const portNames = [];
    for (let i = 0; i < numPorts; i++) {
      portNames.push(i, this.input.getPortName(i));
    }
    return portNames;
  }

  openPort(i) {
    this.input.openPort(i);
  }
}

module.exports = Midi;
