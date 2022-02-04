const express = require('express')
var cors = require('cors')

const Sampler = require('./sampler')
const MidiHandler = require('./midi')
const RtpServer = require('./rtpmidi')

const sampler = new Sampler()
const midiHandler = new MidiHandler(sampler.send)
midiHandler.openPort(1)
new RtpServer('Sampler', 5051, sampler.send)

const app = express()
app.use(cors())
const port = 8080

app.use(express.static('../build'))

process.on('exit', (code) => {
  console.log('process exit, code: ' + code)
  sampler.kill()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
