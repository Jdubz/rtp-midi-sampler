const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const config = require('./config')

const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = 8080

app.use(express.static('../build'))
config(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
