/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

// Link Schema for common link structure
const LinkSchema = new mongoose.Schema({
  href: {
    type: String,
    required: true
  },
  rel: {
    type: String,
    required: true
  },
  method: {
    type: mongoose.Schema.Types.Mixed, // Can be String or Array
    required: true
  }
}, { _id: false })

// Digital Twin Schema
const DigitalTwinSchema = new mongoose.Schema({
  forms: [LinkSchema]
}, { _id: false })

// Backup Restore Schema
const BackupRestoreSchema = new mongoose.Schema({
  links: [LinkSchema]
}, { _id: false })

// Factory Settings Schema
const FactorySettingsSchema = new mongoose.Schema({
  links: [LinkSchema]
}, { _id: false })

// Firmware Update Schema
const FirmwareUpdateSchema = new mongoose.Schema({
  links: [LinkSchema]
}, { _id: false })

// IODD Device Schema
const IoddDeviceSchema = new mongoose.Schema({
  device_name: {
    type: String,
    required: true
  },
  vendor_name: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  size_in_kb: String
}, { _id: false })

// IODD Catalog Schema
const IoddCatalogSchema = new mongoose.Schema({
  ethIpv4: [IoddDeviceSchema]
}, { _id: false })

// Main Maintenance Schema
const MaintenanceSchema = new mongoose.Schema({
  digitaltwin: DigitalTwinSchema,
  backup_restore: BackupRestoreSchema,
  factorysettings: FactorySettingsSchema,
  firmware_update: FirmwareUpdateSchema,
  iodd_catalog: IoddCatalogSchema,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
})

MaintenanceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.updatedAt
    delete returnedObject.createdAt
    delete returnedObject.user
  }
})

module.exports = mongoose.model('Maintenance', MaintenanceSchema)