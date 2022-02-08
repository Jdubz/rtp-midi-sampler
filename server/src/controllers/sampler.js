
class SamplerController {
  constructor(service) {
    this.service = service
  }

  playSample = (req, res) => {
    console.log(req.body)
    this.service.playFile(req.body.file)
    res.send('success')
  }
}

module.exports = SamplerController
