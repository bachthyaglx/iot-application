/* eslint-disable linebreak-style */
// ./src/controllers/configurationController.js

/**
 * @swagger
 * tags:
 *   - name: Configuration
 *     description: Device configuration management
 *
 * /api/configuration:
 *   get:
 *     summary: Get device configuration
 *     description: Returns complete device configuration or filtered by topic/subtopic. Data is cached in Redis.
 *     tags: [Configuration]
 *     parameters:
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *         description: Configuration topic (e.g., show-all, mqtt)
 *       - in: query
 *         name: subtopic
 *         schema:
 *           type: string
 *         description: Configuration subtopic (e.g., show-all)
 *     responses:
 *       200:
 *         description: Configuration data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create/Update configuration
 *     description: Creates or updates device configuration. Requires authentication.
 *     tags: [Configuration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 *       500:
 *         description: Failed to update configuration
 *
 *   patch:
 *     summary: Partially update configuration
 *     description: Partially updates device configuration. Requires authentication.
 *     tags: [Configuration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuration updated successfully
 *       404:
 *         description: Configuration not found
 *       500:
 *         description: Failed to update configuration
 */

const Configuration = require('../models/configuration')
const { cacheGet, cacheSet, client } = require('../utils/redisClient')

const CACHE_KEY = 'configuration'
const CACHE_TOPIC_PREFIX = 'configuration:topic:'

// Static topic lists
const TOPICS_SHOW_ALL = [
  'network',
  'profinet',
  'snmp',
  'mqtt'
]

const MQTT_SUBTOPICS = [
  'mqtt-topic-add',
  'mqtt-topic-set',
  'mqtt-topic-del',
  'mqtt-topic-management',
  'mqtt-topic-max',
  'mqtt-config',
  'mqtt-topic-table'
]

// GET /api/configuration
const getConfiguration = async (req, res) => {
  try {
    const { topic, subtopic } = req.query

    // Handle special topic queries
    if (topic === 'show-all') {
      const cacheKey = `${CACHE_TOPIC_PREFIX}show-all`
      const cached = await cacheGet(cacheKey)
      if (cached) {
        return res.json(cached)
      }
      await cacheSet(cacheKey, TOPICS_SHOW_ALL, 300)
      return res.json(TOPICS_SHOW_ALL)
    }

    // Handle MQTT subtopics
    if (topic === 'mqtt' && subtopic === 'show-all') {
      const cacheKey = `${CACHE_TOPIC_PREFIX}mqtt:show-all`
      const cached = await cacheGet(cacheKey)
      if (cached) {
        return res.json(cached)
      }
      await cacheSet(cacheKey, MQTT_SUBTOPICS, 300)
      return res.json(MQTT_SUBTOPICS)
    }

    // Get full configuration
    const cacheKey = topic ? `${CACHE_KEY}:${topic}` : CACHE_KEY
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return res.json(cached)
    }

    // Query database
    let configuration = await Configuration.findOne({})

    // If no configuration exists, create default empty one
    if (!configuration) {
      configuration = new Configuration({
        Fieldbus: {},
        MQTT: {},
        Ports: new Map(),
        JSON: {},
        SNTP: {},
        UserManagement: { Users: [] }
      })
      await configuration.save()
    }

    // Convert to plain object
    const configData = configuration.toJSON()

    // Filter by topic if provided
    let response = configData
    if (topic && configData[topic]) {
      response = configData[topic]
    }

    // Cache the result
    await cacheSet(cacheKey, response, 300) // Cache for 5 minutes

    res.json(response)
  } catch (error) {
    console.error('❌ Error getting configuration:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: error.message,
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// POST /api/configuration - Create or full update
const createConfiguration = async (req, res) => {
  try {
    let configuration = await Configuration.findOne({})

    if (!configuration) {
      // Create new configuration
      configuration = new Configuration(req.body)
    } else {
      // Full replacement
      Object.keys(req.body).forEach(key => {
        configuration[key] = req.body[key]
      })
    }

    const updated = await configuration.save()

    // Invalidate all configuration caches
    const keys = await client.keys(`${CACHE_KEY}*`)
    if (keys.length > 0) {
      await client.del(keys)
    }

    res.json({
      message: 'POST request received, 200',
      data: updated.toJSON()
    })
  } catch (error) {
    console.error('❌ Failed to create/update configuration:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to create/update configuration',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// PATCH /api/configuration - Partial update
const updateConfiguration = async (req, res) => {
  try {
    const configuration = await Configuration.findOne({})

    if (!configuration) {
      return res.status(404).json({
        title: 'Not Found',
        detail: 'Configuration not found',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found',
        status: 404
      })
    }

    // Partial update - merge with existing data
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
        // Deep merge for objects
        configuration[key] = {
          ...configuration[key],
          ...req.body[key]
        }
      } else {
        configuration[key] = req.body[key]
      }
    })

    const updated = await configuration.save()

    // Invalidate all configuration caches
    const keys = await client.keys(`${CACHE_KEY}*`)
    if (keys.length > 0) {
      await client.del(keys)
    }

    res.json({
      message: 'POST request received, 200',
      data: updated.toJSON()
    })
  } catch (error) {
    console.error('❌ Failed to update configuration:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to update configuration',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

module.exports = {
  getConfiguration,
  createConfiguration,
  updateConfiguration
}