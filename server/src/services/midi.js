const midi = require('midi');

class Midi {
  constructor(callback) {
    this.input = new midi.Input();
    this.portMap = {};

    this.input.on('message', (deltaTime, message) => {
      callback(message);
    });
    this.openPort = this.openPort.bind(this);
    this.getDevices = this.getDevices.bind(this);
  }

  getDevices = () => {
    const numPorts = this.input.getPortCount();
    const portNames = [];
    for (let i = 0; i < numPorts; i++) {
      portNames.push(i, this.input.getPortName(i));
    }
    return portNames;
  }

  openPort = (i) => {
    this.input.openPort(i);
  }
}

module.exports = Midi;
