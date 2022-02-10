class MidiController {
  constructor(service) {
    this.service = service
  }

  getDevices = async (req, res) => {
    const devices = await this.service.getDevices();
    res.send(devices)
  }

  openDevice = async (req, res) => {
    const response = await this.service.openPort(req.body)
    res.send(response)
  }

  getChannels = async (req, res) => {
    const response = await this.service.getChannels()
    res.send(response)
  }

  updateChannel = async (req, res) => {
    const response = await this.service.updateChannel(req.body.channel, req.body.folder)
    res.send(response)
  }
}

module.exports = MidiController
