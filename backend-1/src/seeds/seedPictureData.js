/* eslint-disable linebreak-style */
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
const Picture = require('../models/picture')
const User = require('../models/user')

const uploadPicture = async () => {
  try {
    console.log('🌱 Uploading picture...')

    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const filePath = path.join(__dirname, '..', 'public', 'device-1.jpg')

    if (!fs.existsSync(filePath)) {
      console.error('❌ File "device-1.jpg" not found in /public directory')
      console.error(`   Expected path: ${filePath}`)
      await mongoose.connection.close()
      process.exit(1)
    }

    const user = await User.findOne({ username: 'admin' })
    if (!user) {
      console.error('❌ Admin user not found. Please create the admin user first.')
      await mongoose.connection.close()
      process.exit(1)
    }

    const existing = await Picture.findOne({ filename: 'device-1.jpg', user: user._id })
    if (existing) {
      console.log('ℹ️  Picture already exists for this user. Skipping upload.')
      await mongoose.connection.close()
      process.exit(0)
    }

    const imageBuffer = fs.readFileSync(filePath)
    console.log(`📷 Image loaded: ${imageBuffer.length} bytes`)

    const picture = new Picture({
      filename: 'device-1.jpg',
      contentType: 'image/jpeg',
      data: imageBuffer,
      user: user._id
    })

    await picture.save()
    console.log('✅ Picture uploaded from /public/device-1.jpg and linked to admin user.')

    await mongoose.connection.close()
    console.log('✅ Database connection closed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Upload failed:', err.message)
    console.error(err)
    process.exit(1)
  }
}

// Run the seed function
uploadPicture()