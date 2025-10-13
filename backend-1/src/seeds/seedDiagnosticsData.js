/* eslint-disable linebreak-style */
require('dotenv').config()
const mongoose = require('mongoose')
const Diagnostics = require('../models/diagnostics')
const User = require('../models/user')

const seedDiagnostics = async () => {
  try {
    console.log('🌱 Seeding diagnostics...')

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const diagnosticsExist = await Diagnostics.exists({})
    if (diagnosticsExist) {
      console.log('ℹ️  Diagnostics already exist. Skipping seed.')
      await mongoose.connection.close()
      process.exit(0)
    }

    const user = await User.findOne({ username: 'admin' })
    if (!user) {
      console.error('❌ Admin user not found. Please create the admin user first.')
      await mongoose.connection.close()
      process.exit(1)
    }

    const diagnostics = new Diagnostics({
      PortStatistics: [
        {
          key: 'Peripheriediagnose',
          description: 'Short circuit at Pin 1 detected',
          channel: '3',
          severity: 'Maintenance requested',
          type: 'Occured',
          time: '000114:11:26:39'
        },
        {
          key: 'IO-Link Master Event',
          description: 'Overcurrent at Us - check power supply (e.g: Us+)',
          channel: '3',
          severity: 'Fault',
          type: 'Occured',
          time: '000114:11:26:39'
        },
        {
          key: 'IO-Link Master Event',
          description: 'Short circuit at Us - check wire connection',
          channel: '3',
          severity: 'Fault',
          type: 'Occured',
          time: '000114:11:26:39'
        }
      ],
      user: user._id
    })

    await diagnostics.save()
    console.log(`✅ Diagnostics with ${diagnostics.PortStatistics.length} entries seeded successfully.`)

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
seedDiagnostics()