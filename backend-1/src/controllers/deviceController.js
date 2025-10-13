/* eslint-disable linebreak-style */
// ./src/controllers/deviceController.js

/**
 * @swagger
 * tags:
 *   - name: Device Ports
 *     description: Device port information and configuration
 *
 * /api/device/port/{portId}:
 *   get:
 *     summary: Get specific port information
 *     description: Returns information for a specific port. Data is cached in Redis for performance.
 *     tags: [Device Ports]
 *     parameters:
 *       - in: path
 *         name: portId
 *         required: true
 *         schema:
 *           type: string
 *         description: Port identifier (e.g., XD1, XF1, X0, HMI)
 *     responses:
 *       200:
 *         description: Port information array with fields and data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 oneOf:
 *                   - type: array
 *                     items:
 *                       type: string
 *                   - type: object
 *       401:
 *         description: Unauthorized - Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 detail:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: integer
 *       404:
 *         description: Port not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 detail:
 *                   type: string
 *                 type:
 *                   type: string
 *                 status:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *
 * /api/device/ports:
 *   get:
 *     summary: Get all ports information
 *     description: Returns information for all device ports. Data is cached in Redis.
 *     tags: [Device Ports]
 *     responses:
 *       200:
 *         description: Object containing all ports data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

const Device = require('../models/device')
const { cacheGet, cacheSet, client } = require('../utils/redisClient')

const CACHE_PREFIX = 'device:port:'
const ALL_PORTS_CACHE_KEY = 'device:all_ports'

// Helper function to format port data response
const formatPortResponse = (device) => {
  if (!device) return null

  // Special format for HMI port (return object directly)
  if (device.portId === 'HMI') {
    return device.data
  }

  // Standard format for other ports (return array with fields and data)
  return [device.fields, device.data]
}

// GET /api/device/port/:portId
const getDevicePort = async (req, res) => {
  try {
    const portId = req.params.portId.toUpperCase()
    const cacheKey = `${CACHE_PREFIX}${portId}`

    // Check cache first
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    // Query database
    const device = await Device.findOne({ portId })

    if (!device) {
      return res.status(404).json({
        title: 'Not Found',
        detail: 'Unknown Element not found',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found',
        status: 404
      })
    }

    const response = formatPortResponse(device)

    // Cache the result
    await cacheSet(cacheKey, response, 300) // Cache for 5 minutes

    res.json(response)
  } catch (error) {
    console.error('❌ Error getting device port:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: error.message,
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// GET /api/device/ports - Get all ports
const getAllDevicePorts = async (req, res) => {
  try {
    // Check cache first
    const cached = await cacheGet(ALL_PORTS_CACHE_KEY)
    if (cached) {
      return res.json(cached)
    }

    // Query all devices
    const devices = await Device.find({})

    // Format response as object with portId as key
    const portsData = {}
    devices.forEach(device => {
      portsData[device.portId] = formatPortResponse(device)
    })

    // Cache the result
    await cacheSet(ALL_PORTS_CACHE_KEY, portsData, 300) // Cache for 5 minutes

    res.json(portsData)
  } catch (error) {
    console.error('❌ Error getting all device ports:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: error.message,
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// PUT /api/device/port/:portId - Update port configuration
const updateDevicePort = async (req, res) => {
  try {
    const portId = req.params.portId.toUpperCase()

    const device = await Device.findOne({ portId })

    if (!device) {
      return res.status(404).json({
        title: 'Not Found',
        detail: 'Unknown Element not found',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found',
        status: 404
      })
    }

    // Update device data
    if (req.body.data) {
      Object.assign(device.data, req.body.data)
    }

    const updated = await device.save()

    // Invalidate cache
    const cacheKey = `${CACHE_PREFIX}${portId}`
    await client.del(cacheKey)
    await client.del(ALL_PORTS_CACHE_KEY)

    const response = formatPortResponse(updated)
    res.json(response)
  } catch (error) {
    console.error('❌ Failed to update device port:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to update device port',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

module.exports = {
  getDevicePort,
  getAllDevicePorts,
  updateDevicePort
}