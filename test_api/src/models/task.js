const { Schema, model } = require('mongoose')

const tasksSchema = new Schema({
    name: String,
    owner: { type : Schema.ObjectId, ref: 'Users' },
    project: { type : Schema.ObjectId, ref: 'Projects' },
    mode: String,            // [M]anual | [T]imer
    durationHours: Number,   // For record
    durationMinutes: Number, // For record
    durationSeconds: Number, // For record
    startDate: Date,
    finishDate: Date,        // Calculated on save
    createdAt: Date,
    updatedAt: Date,
})

module.exports = model('Tasks', tasksSchema)