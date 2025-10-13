/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

// Fieldbus Configuration Schema
const FieldbusSchema = new mongoose.Schema({
  fieldbusStatus: String,
  fieldbusProtocol: String,
  addressing: String,
  ipAddress: String,
  subnetMask: String,
  standardGateway: String
}, { _id: false })

// MQTT Configuration Schema
const MqttLastWillSchema = new mongoose.Schema({
  topic: String,
  message: String,
  qos: String,
  retain: String
}, { _id: false })

const MqttSchema = new mongoose.Schema({
  clientMode: String,
  ipAddress: String,
  serverAddress: String,
  username: String,
  password: String,
  lastwill: MqttLastWillSchema,
  keepAliveTime: Number
}, { _id: false })

// Port Configuration Schema
const PortConfigSchema = new mongoose.Schema({
  configuration: String,
  adminstate: String
}, { _id: false })

const PortStatusSchema = new mongoose.Schema({
  mode: String,
  speed: Number
}, { _id: false })

const PortItemSchema = new mongoose.Schema({
  type: String,
  descr: String,
  capabilities: String,
  configuration: PortConfigSchema,
  status: PortStatusSchema
}, { _id: false })

// JSON Configuration Schema
const JsonConfigSchema = new mongoose.Schema({
  json_configuration: {
    json: String
  }
}, { _id: false })

// SNTP Configuration Schema
const SntpSchema = new mongoose.Schema({
  SNTP_client_parameter_settings: {
    IP_addresse_of_the_NTP_server: String,
    IP_address_of_the_NTP_fallback_server: String
  }
}, { _id: false })

// User Management Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  firstname: String,
  lastname: String,
  role: {
    type: String,
    enum: ['admin', 'maintenance', 'operator'],
    required: true
  },
  lastIp: String
}, { _id: false })

const UserManagementSchema = new mongoose.Schema({
  Users: [UserSchema]
}, { _id: false })

// Main Configuration Schema
const ConfigurationSchema = new mongoose.Schema({
  Fieldbus: FieldbusSchema,
  MQTT: MqttSchema,
  Ports: {
    type: Map,
    of: PortItemSchema
  },
  JSON: JsonConfigSchema,
  SNTP: SntpSchema,
  UserManagement: UserManagementSchema,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
})

ConfigurationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.updatedAt
    delete returnedObject.createdAt
    delete returnedObject.user

    // Convert Map to Object for Ports
    if (returnedObject.Ports instanceof Map) {
      returnedObject.Ports = Object.fromEntries(returnedObject.Ports)
    }
  }
})

module.exports = mongoose.model('Configuration', ConfigurationSchema)