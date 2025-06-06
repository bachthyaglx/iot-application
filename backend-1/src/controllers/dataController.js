/* eslint-disable linebreak-style */
/* ./src/controllers/dataController.js */

/**
 * @swagger
 * /api/data:
 *   get:
 *     summary: Get latest sensor data
 *     description: Returns the most recent values for temperature, voltage, humidity, etc.
 *     tags: [Sensor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: JSON object with latest sensor values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 temperature:
 *                   value: 25.1
 *                   timestamp: 2025-06-03T22:59:46.725Z
 *                   type: temperature
 *                 voltage:
 *                   value: 230.5
 *                   timestamp: 2025-06-03T22:59:46.725Z
 *                   type: voltage
 *                 humidity:
 *                   value: 60.4
 *                   timestamp: 2025-06-03T22:59:46.725Z
 *                   type: humidity
 *       401:
 *         description: Unauthorized - missing or invalid token
 */

const config = require('../utils/config')
const { createClient } = require('redis')
const sensorTypes = require('../data-simulator/types')

const redis = createClient({ url: config.REDIS_URL })
redis.connect().catch(console.error)

const getRealTimeData = async (req, res) => {
  const response = {}

  for (const type of sensorTypes) {
    const raw = await redis.get(`latest:${type}`)
    if (raw) {
      response[type] = JSON.parse(raw)
    } else {
      response[type] = { message: 'No data yet' }
    }
  }

  res.json({
    ...response
  })
}

module.exports = {
  getRealTimeData,
}
