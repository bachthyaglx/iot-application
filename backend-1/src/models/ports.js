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
}, { _id: false, strict: false })

const PortDataSchema = new mongoose.Schema({
  type: String,
  descr: String,
  capabilities: mongoose.Schema.Types.Mixed, // Can be String or Object
  configuration: {
    type: PortConfigurationSchema,
    default: {}
  },
  status: mongoose.Schema.Types.Mixed // Can be String or Object
}, { _id: false, strict: false })

const PortsSchema = new mongoose.Schema({
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
  data: {
    type: PortDataSchema,
    default: {}
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
})

PortsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.updatedAt
    delete returnedObject.createdAt
    delete returnedObject.user
  }
})

module.exports = mongoose.model('Ports', PortsSchema)