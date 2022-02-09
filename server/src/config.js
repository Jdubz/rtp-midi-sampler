const SamplerService = require('./services/sampler')
const MidiService = require('./services/midi')
const RtpService = require('./services/rtpmidi')
const SamplesService = require('./services/samples')
const Storage = require('./services/storage')

const SamplesController = require('./controllers/samples')
const SamplerController = require('./controllers/sampler')
const MidiController = require('./controllers/midi')
const AudioController = require('./controllers/audio')

const applyRoutes = async (app) => {
  const storage = new Storage()
  await storage.index()
  const samplesService = new SamplesService(storage)
  const samplerService = new SamplerService(storage)
  const midiService = new MidiService(samplerService.sendMidi, storage)
  await midiService.init()
  const rtpService = new RtpService('Sampler', 5051, samplerService.sendMidi)

  const samplesController = new SamplesController(samplesService)
  const samplerController = new SamplerController(samplerService)
  const midiController = new MidiController(midiService)
  const audioController = new AudioController(samplerService)

  app.get('/samples', samplesController.getSamples)
  app.post('/sampler/playFile', samplerController.playSample)
  app.get('/midi', midiController.getDevices)
  app.post('/midi', midiController.openDevice)
  app.get('/audio', audioController.getDevices)

  process.on('exit', (code) => {
    console.log('process exit, code: ' + code)
    samplerService.kill()
  })
}

module.exports = applyRoutes;
