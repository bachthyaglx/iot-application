/* eslint-disable linebreak-style */
// ./src/socket/socketPublisher.js
const { createClient } = require('redis')
const { generateValue } = require('../data-simulator/generator')
const sensorTypes = require('../data-simulator/types')
const config = require('../utils/config')

const redisUrl = config.REDIS_URL || 'redis://redis:6379'
const pub = createClient({ url: redisUrl })

async function start() {
  await pub.connect()
  console.log('🔁 Publisher started')

  setInterval(() => {
    const now = new Date().toISOString()
    for (const type of sensorTypes) {
      const value = generateValue(type)
      pub.publish(`sensor:${type}`, JSON.stringify({ value, timestamp: now }))
    }
  }, 1000)
}

start().catch(console.error)
