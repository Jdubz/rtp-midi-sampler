const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const Socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = Socketio(server, { cors: {
  origin: true,
}})

const config = require('./config')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('../build'))

config(app, io)

// TODO should be configurable
const port = 8080
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
