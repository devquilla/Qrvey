const express = require('express')
const path = require('path');
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/v1', require('./controllers/v1'))

module.exports = app