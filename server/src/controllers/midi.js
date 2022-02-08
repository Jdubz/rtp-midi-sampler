class MidiController {
  constructor(service) {
    this.service = service
  }

  getDevices = (req, res) => {
    const devices = this.service.getDevices();
    res.send(devices)
  }
}

module.exports = MidiController
