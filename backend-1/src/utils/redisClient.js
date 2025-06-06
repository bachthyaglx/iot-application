/* eslint-disable linebreak-style */
const redis = require('redis')

const client = redis.createClient({
  url: process.env.REDIS_URL
})

client.on('error', (err) => console.error('❌ Redis Client Error:', err))
client.on('connect', () => console.log('✅ Redis connected'))

client.connect().catch(err => {
  console.error('Redis connection failed:', err)
})

// Default TTL (24 hours)
const DEFAULT_TTL = 60 * 60 * 24

/**
 * Set value in Redis cache
 * @param {string} key
 * @param {object|string} value
 * @param {number} ttl (optional) TTL in seconds
 */
const cacheSet = async (key, value, ttl = DEFAULT_TTL) => {
  try {
    const data = typeof value === 'string' ? value : JSON.stringify(value)
    await client.set(key, data, { EX: ttl })
  } catch (err) {
    console.error(`❌ Redis cacheSet error for key "${key}":`, err)
  }
}

/**
 * Get value from Redis cache
 * @param {string} key
 * @returns {object|null}
 */
const cacheGet = async (key) => {
  try {
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (err) {
    console.error(`❌ Redis cacheGet error for key "${key}":`, err)
    return null
  }
}

module.exports = {
  client,
  cacheSet,
  cacheGet
}
