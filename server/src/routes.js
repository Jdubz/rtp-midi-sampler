const SamplerService = require('./services/sampler')
const MidiService = require('./services/midi')
const RtpService = require('./services/rtpmidi')
const SamplesService = require('./services/samples')

const SamplesController = require('./controllers/samples')
const SamplerController = require('./controllers/sampler')
const MidiController = require('./controllers/midi')
const AudioController = require('./controllers/audio')

const applyRoutes = (app) => {
  const samplesService = new SamplesService()
  const samplerService = new SamplerService()
  const midiService = new MidiService(samplerService.sendMidi)
  const rtpService = new RtpService('Sampler', 5051, samplerService.sendMidi)

  const samplesController = new SamplesController(samplesService)
  const samplerController = new SamplerController(samplerService)
  const midiController = new MidiController(midiService)
  const audioController = new AudioController(samplerService)

  app.get('/samples', samplesController.getSamples)
  app.post('/sampler/playFile', samplerController.playSample)
  app.get('/midi', midiController.getDevices)
  app.get('/audio', audioController.getDevices)
}

module.exports = applyRoutes;
