/* eslint-disable linebreak-style */
// utils/mongo.js
const mongoose = require('mongoose')
const config = require('./config')
const logger = require('./logger')

mongoose.set('strictQuery', false)

const connectToMongo = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    logger.info('✅ Connected to MongoDB')
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error.message)
    process.exit(1)
  }
}

module.exports = connectToMongo
