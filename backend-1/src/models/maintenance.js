/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

// Link Schema for common link structure
const LinkSchema = new mongoose.Schema({
  href: String,
  rel: String,
  method: mongoose.Schema.Types.Mixed // Can be String or Array
}, { _id: false })

// Digital Twin Schema
const DigitalTwinSchema = new mongoose.Schema({
  forms: {
    type: [LinkSchema],
    default: []
  }
}, { _id: false })

// Backup Restore Schema
const BackupRestoreSchema = new mongoose.Schema({
  links: {
    type: [LinkSchema],
    default: []
  }
}, { _id: false })

// Factory Settings Schema
const FactorySettingsSchema = new mongoose.Schema({
  links: {
    type: [LinkSchema],
    default: []
  }
}, { _id: false })

// Firmware Update Schema
const FirmwareUpdateSchema = new mongoose.Schema({
  links: {
    type: [LinkSchema],
    default: []
  }
}, { _id: false })

// IODD Device Schema
const IoddDeviceSchema = new mongoose.Schema({
  device_name: String,
  vendor_name: String,
  version: String,
  size_in_kb: String
}, { _id: false })

// IODD Catalog Schema
const IoddCatalogSchema = new mongoose.Schema({
  ethIpv4: {
    type: [IoddDeviceSchema],
    default: []
  }
}, { _id: false })

// Main Maintenance Schema
const MaintenanceSchema = new mongoose.Schema({
  digitaltwin: {
    type: DigitalTwinSchema,
    default: () => ({ forms: [] })
  },
  backup_restore: {
    type: BackupRestoreSchema,
    default: () => ({ links: [] })
  },
  factorysettings: {
    type: FactorySettingsSchema,
    default: () => ({ links: [] })
  },
  firmware_update: {
    type: FirmwareUpdateSchema,
    default: () => ({ links: [] })
  },
  iodd_catalog: {
    type: IoddCatalogSchema,
    default: () => ({ ethIpv4: [] })
  },
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