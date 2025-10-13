/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

const PortStatisticSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  channel: String,
  severity: {
    type: String,
    enum: ['Info', 'Warning', 'Maintenance requested', 'Fault', 'Critical'],
    required: true
  },
  type: {
    type: String,
    enum: ['Occured', 'Cleared', 'Active', 'Inactive'],
    required: true
  },
  time: String
}, { _id: false })

const DiagnosticsSchema = new mongoose.Schema({
  PortStatistics: {
    type: [PortStatisticSchema],
    default: []
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
})

DiagnosticsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.updatedAt
    delete returnedObject.createdAt
    delete returnedObject.user
  }
})

module.exports = mongoose.model('Diagnostics', DiagnosticsSchema)