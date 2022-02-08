
class AudioController {
  constructor(service) {
    this.service = service
  }

  getDevices = async (req, res) => {
    const devices = await this.service.getAudioDevices()
    res.send(devices)
  }
}

module.exports = AudioController
