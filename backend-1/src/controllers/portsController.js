/* eslint-disable linebreak-style */
// ./src/controllers/portsController.js

const Ports = require('../models/ports')
const { cacheGet, cacheSet, client } = require('../utils/redisClient')

const CACHE_PREFIX = 'device:port:'
const ALL_PORTS_CACHE_KEY = 'device:all_ports'

// Helper function to format port data response
const formatPortResponse = (port, includePortId = false) => {
  if (!port) return null

  // Return data as object (consistent format for all ports)
  const data = port.data.toObject ? port.data.toObject() : port.data

  if (includePortId) {
    return {
      portId: port.portId,
      ...data
    }
  }

  return data
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
    const port = await Ports.findOne({ portId })

    if (!port) {
      return res.status(404).json({
        title: 'Not Found',
        detail: 'Unknown Element not found',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found',
        status: 404
      })
    }

    // Include portId in single port response
    const response = formatPortResponse(port, true)

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
    const ports = await Ports.find({})

    // Format response as object with portId as key, data as nested object
    const portsData = {}
    ports.forEach(port => {
      portsData[port.portId] = formatPortResponse(port, false)
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

    const port = await Ports.findOne({ portId })

    if (!port) {
      return res.status(404).json({
        title: 'Not Found',
        detail: 'Unknown Element not found',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found',
        status: 404
      })
    }

    // Update device data
    if (req.body.data) {
      Object.assign(port.data, req.body.data)
    }

    const updated = await port.save()

    // Invalidate cache
    const cacheKey = `${CACHE_PREFIX}${portId}`
    await client.del(cacheKey)
    await client.del(ALL_PORTS_CACHE_KEY)

    const response = formatPortResponse(updated, true)
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