/* eslint-disable linebreak-style */
require('dotenv').config()
const mongoose = require('mongoose')
const Info = require('../models/info')
const User = require('../models/user')

const seedOneDevice = async () => {
  await mongoose.connect(process.env.MONGODB_URI)

  const deviceExists = await Info.exists({})
  if (deviceExists) {
    console.log('✅ A device already exists. Skipping seed.')
    await mongoose.connection.close()
    return
  }

  const user = await User.findOne({ username: 'admin' })
  if (!user) {
    console.error('❌ Admin user not found. Please create the admin user first.')
    await mongoose.connection.close()
    return
  }

  const device = new Info({
    deviceClass: 'Sensor',
    manufacturer: 'Siemens',
    manufacturerUri: 'https://siemens.com',
    model: 'S7-1200',
    productCode: 112233,
    hardwareRevision: 'v1.1',
    softwareRevision: 'v2.0.1',
    serialNumber: 'SN1234567890',
    productInstanceUri: 'https://siemens.com/s7-1200',
    webshopUri: 'https://shop.siemens.com/s7-1200',
    sysDescr: 'Temperature Sensor Module',
    sysName: 'TempSensor01',
    sysContact: 'support@siemens.com',
    sysLocation: 'Berlin Factory 3',
    user: user._id
  })

  await device.save()
  console.log('✅ 1 fake device seeded successfully.')

  await mongoose.connection.close()
}

seedOneDevice().catch(err => {
  console.error('❌ Seeding failed:', err.message)
})
