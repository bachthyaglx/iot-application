/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

const PortConfigurationSchema = new mongoose.Schema({
  label: String,
  adminstate: String,
  portmode: String,
  mdi: String,
  mode: String,
  validationAndBackup: String,
  iqConfiguration: String,
  cycleTime: {
    value: Number,
    unit: String
  },
  vendorId: Number,
  deviceId: Number,
  deviceAlias: String,
  datastorage: {
    header: {
      vendorId: Number,
      deviceId: Number,
      ioLinkRevision: String,
      parameterChecksum: Number
    },
    content: String
  }
}, { _id: false })

const PortDataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  descr: String,
  capabilities: mongoose.Schema.Types.Mixed, // Can be String or Object
  configuration: PortConfigurationSchema,
  status: mongoose.Schema.Types.Mixed // Can be String or Object
}, { _id: false })

const DeviceSchema = new mongoose.Schema({
  portId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  fields: {
    type: [String],
    default: ['type', 'descr', 'capabilities', 'configuration', 'status']
  },
  data: PortDataSchema,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
})

DeviceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.updatedAt
    delete returnedObject.createdAt
  }
})

module.exports = mongoose.model('Device', DeviceSchema)