const express = require('express')
const app = express()

app.use('/users', require('../routes/users'))
app.use('/tasks', require('../routes/tasks'))
app.use('/projects', require('../routes/projects'))

module.exports = app