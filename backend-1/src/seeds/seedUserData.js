/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const createAdminUser = async () => {
  try {
    console.log('🌱 Creating admin user...')

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ username: 'admin' })
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists. Skipping creation.')
      await mongoose.connection.close()
      process.exit(0)
    }

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
      username: 'admin',
      passwordHash,
    })

    await user.save()
    console.log('✅ Admin user created successfully')
    console.log('   Username: admin')
    console.log('   Password: password')

    await mongoose.connection.close()
    console.log('✅ Database connection closed')
    process.exit(0)
  } catch (err) {
    console.error('❌ User creation failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

// Run the seed function
createAdminUser()