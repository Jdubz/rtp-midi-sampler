const applyRoutes = (
  app,
  sampleController,
  samplerController,
  midiController,
  audioController,
) => {
  app.get('samples', sampleController.getSamples)

  app.post('sampler/play', samplerController.playSample)
  
  app.get('midi', midiController.getDevices)
  
  app.get('audio', audioController.getDevices)
}

module.exports = applyRoutes;
