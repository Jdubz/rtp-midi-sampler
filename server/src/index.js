const express = require('express')
var cors = require('cors')

const applyRoutes = require('./routes')
const Sampler = require('./services/sampler')
const MidiHandler = require('./services/midi')
const RtpServer = require('./services/rtpmidi')

const sampler = new Sampler()
const midiHandler = new MidiHandler(sampler.sendMidi)
midiHandler.openPort(1)
new RtpServer('Sampler', 5051, sampler.sendMidi)

const app = express()
app.use(cors())
const port = 8080

app.use(express.static('../build'))
applyRoutes(app)

process.on('exit', (code) => {
  console.log('process exit, code: ' + code)
  sampler.kill()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
