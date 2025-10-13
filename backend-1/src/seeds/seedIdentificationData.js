/* eslint-disable linebreak-style */
require('dotenv').config()
const mongoose = require('mongoose')
const Identification = require('../models/identification')
const User = require('../models/user')

const seedOneDevice = async () => {
  try {
    console.log('🌱 Seeding identification...')

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const deviceExists = await Identification.exists({})
    if (deviceExists) {
      console.log('ℹ️  A device already exists. Skipping seed.')
      await mongoose.connection.close()
      process.exit(0)
    }

    const user = await User.findOne({ username: 'admin' })
    if (!user) {
      console.error('❌ Admin user not found. Please create the admin user first.')
      await mongoose.connection.close()
      process.exit(1)
    }

    const device = new Identification({
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
    console.log('✅ 1 identification device seeded successfully.')

    await mongoose.connection.close()
    console.log('✅ Database connection closed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

// Run the seed function
seedOneDevice()