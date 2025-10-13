/* eslint-disable linebreak-style */
require('dotenv').config()
const mongoose = require('mongoose')
const Maintenance = require('../models/maintenance')
const User = require('../models/user')

const seedMaintenance = async () => {
  try {
    console.log('🌱 Seeding maintenance...')

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const maintenanceExists = await Maintenance.exists({})
    if (maintenanceExists) {
      console.log('ℹ️  Maintenance data already exists. Skipping seed.')
      await mongoose.connection.close()
      process.exit(0)
    }

    const user = await User.findOne({ username: 'admin' })
    if (!user) {
      console.error('❌ Admin user not found. Please create the admin user first.')
      await mongoose.connection.close()
      process.exit(1)
    }

    const maintenance = new Maintenance({
      digitaltwin: {
        forms: [
          {
            href: 'http://aas.murrelektronik.com/V000-PS048-0100001/SN01234564',
            rel: 'aas',
            method: ['GET', 'POST']
          }
        ]
      },

      backup_restore: {
        links: [
          {
            href: '/reboot',
            rel: 'reboot',
            method: 'POST'
          }
        ]
      },

      factorysettings: {
        links: [
          {
            href: '/factorysettings',
            rel: 'factorysettings',
            method: 'POST'
          }
        ]
      },

      firmware_update: {
        links: [
          {
            href: '/fwupdate',
            rel: 'update',
            method: 'POST'
          }
        ]
      },

      iodd_catalog: {
        ethIpv4: [
          {
            device_name: 'AI',
            vendor_name: 'Murrelektronik GmbH',
            version: '2020-10-01 (V2.0.0)',
            size_in_kb: '5'
          },
          {
            device_name: 'Comlight56',
            vendor_name: 'Murrelektronik GmbH',
            version: '2020-07-29 (V1.0)',
            size_in_kb: '7'
          },
          {
            device_name: 'Modlight70 Pro BASE IOL',
            vendor_name: 'Murrelektronik GmbH',
            version: '2019-11-15 (V1.0)',
            size_in_kb: '6'
          }
        ]
      },

      user: user._id
    })

    await maintenance.save()
    console.log(`✅ Maintenance with ${maintenance.iodd_catalog.ethIpv4.length} IODD devices seeded successfully.`)

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
seedMaintenance()