/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema({
  deviceClass: String,
  manufacturer: String,
  manufacturerUri: String,
  model: String,
  productCode: Number,
  hardwareRevision: String,
  softwareRevision: String,
  serialNumber: String,
  productInstanceUri: String,
  webshopUri: String,
  sysDescr: String,
  sysName: String,
  sysContact: String,
  sysLocation: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
})

deviceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Device', deviceSchema)
