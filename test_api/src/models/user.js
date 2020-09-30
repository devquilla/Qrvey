const { Schema, model } = require('mongoose')

const usersSchema = new Schema({
    id: String,
    name: String,
    createdAt: Date,
    updatedAt: Date,
    tasks: [{ type : Schema.ObjectId, ref: 'Tasks' }]
})

usersSchema.virtual('userId').get(function() {
    return this._id;
});

module.exports = model('Users', usersSchema)