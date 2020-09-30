const { Schema, model } = require('mongoose')

const projectsSchema = new Schema({
    name: String,
    owner: { type : Schema.ObjectId, ref: 'Users' },
    tasks: [{ type : Schema.ObjectId, ref: 'Tasks' }],
    createdAt: Date,
    updatedAt: Date
})

module.exports = model('Projects', projectsSchema)