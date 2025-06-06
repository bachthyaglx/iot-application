/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const createAdminUser = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({
    username: 'admin',
    passwordHash,
  })

  await user.save()
  console.log('Admin user created')

  await mongoose.connection.close()
}

createAdminUser().catch(err => console.error(err))
