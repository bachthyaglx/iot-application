/* eslint-disable linebreak-style */
// ./src/controllers/authController.js

/**
 * @swagger
 * tags:
 *   - name: Device
 *     description: Device information and metadata
 *
 * /api/device-info:
 *   get:
 *     summary: Get device information
 *     description: Returns basic information about the device. Data is cached in Redis for performance.
 *     tags: [Device]
 *     responses:
 *       200:
 *         description: JSON object containing device information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 name: Device 1
 *                 location: Berlin
 *                 type: MVK Pro
 *                 model: A100
 *                 status: online
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update device information
 *     description: Updates the device information and invalidates Redis cache.
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: New Device Name
 *               location: Hanoi
 *               model: B200
 *               status: offline
 *     responses:
 *       200:
 *         description: Updated device information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 name: New Device Name
 *                 location: Hanoi
 *                 model: B200
 *                 status: offline
 *       404:
 *         description: Device not found
 *       500:
 *         description: Failed to update device
 */
const Identification = require('../models/identification')
const { cacheGet, cacheSet, client } = require('../utils/redisClient')

const CACHE_KEY = 'identification' // consistent Redis key

const getIdentification = async (req, res) => {
  const cached = await cacheGet(CACHE_KEY)
  if (cached) {
    return res.json(cached)
  }

  const data = await Identification.findOne({})
  if (data) {
    await cacheSet(CACHE_KEY, data)
  }

  res.json(data)
}

const updateIdentification = async (req, res) => {
  const existing = await Identification.findOne({})
  if (!existing) {
    return res.status(404).json({ error: 'Device not found' })
  }

  Object.assign(existing, req.body)

  try {
    const updated = await existing.save()
    await client.del(CACHE_KEY)
    res.json(updated)
  } catch (err) {
    console.error('❌ Failed to update device:', err)
    res.status(500).json({ error: 'Failed to update device' })
  }
}

module.exports = {
  getIdentification,
  updateIdentification
}
