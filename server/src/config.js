const SamplerService = require('./services/sampler/sampler');
const MidiService = require('./services/midi/midi');
const RtpService = require('./services/midi/rtpmidi');
const SamplesService = require('./services/samples');
const Storage = require('./services/storage');
const Socket = require('./services/midi/socket');

const SamplesController = require('./controllers/samples');
const SamplerController = require('./controllers/sampler');
const MidiController = require('./controllers/midi');
const AudioController = require('./controllers/audio');

const applyRoutes = async (app, io) => {
  const socket = new Socket(io);
  const storage = new Storage();
  await storage.index();
  const samplesService = new SamplesService(storage);
  const samplerService = new SamplerService(storage, socket);
  const midiService = new MidiService(samplerService.sendMidi, storage, samplerService);
  await midiService.init();
  const rtpService = new RtpService('Sampler', 5051, samplerService.sendMidi);

  const samplesController = new SamplesController(samplesService);
  const samplerController = new SamplerController(samplerService);
  const midiController = new MidiController(midiService);
  const audioController = new AudioController(samplerService);

  app.get('/samples', samplesController.getSamples);
  app.post('/sampler/playFile', samplerController.playSample);

  app.get('/midi', midiController.getDevices);
  app.post('/midi', midiController.openDevice);
  app.get('/midi/channels', midiController.getChannels);
  app.post('/midi/channel', midiController.updateChannel);

  app.get('/audio', audioController.getDevices);
  app.get('/audio/output', audioController.getCurrentOutput);
  app.post('/audio/output', audioController.openOutput);
};

module.exports = applyRoutes;
