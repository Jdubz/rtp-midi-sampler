
class AudioController {
  constructor(service) {
    this.service = service
  }

  getDevices = async (req, res) => {
    const devices = await this.service.getAudioDevices()
    res.send(devices)
  }

  getCurrentOutput = async (req, res) => {
    const device = await this.service.getCurrentOutput()
    res.send(device)
  }

  openOutput = async (req, res) => {
    const success = await this.service.openOutput(req.body)
    res.send(success)
  }
}

module.exports = AudioController
