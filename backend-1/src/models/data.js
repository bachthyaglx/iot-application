/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

const dataSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  temperature: {
    type: Number,
    required: true
  },
  voltage: {
    type: Number,
    required: true
  },
  humidity: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
})

dataSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Data', dataSchema)
