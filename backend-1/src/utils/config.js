/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET
const REDIS_URL = process.env.REDIS_URL

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  REDIS_URL
}