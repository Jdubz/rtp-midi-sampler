
class SamplesController {
  constructor(service) {
    this.service = service;
  }

  getSamples = async (req, res) => {
    const samples = await this.service.readSamplesFolder();
    res.send(samples);
  }
};

module.exports = SamplesController;
