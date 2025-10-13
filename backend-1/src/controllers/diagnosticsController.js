/* eslint-disable linebreak-style */
// ./src/controllers/diagnosticsController.js

/**
 * @swagger
 * tags:
 *   - name: Diagnostics
 *     description: Device diagnostics and port statistics
 *
 * /api/diagnostics:
 *   get:
 *     summary: Get device diagnostics
 *     description: Returns device diagnostics including port statistics. Data is cached in Redis for performance.
 *     tags: [Diagnostics]
 *     responses:
 *       200:
 *         description: Diagnostics data with port statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 PortStatistics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       key:
 *                         type: string
 *                       description:
 *                         type: string
 *                       channel:
 *                         type: string
 *                       severity:
 *                         type: string
 *                         enum: [Info, Warning, Maintenance requested, Fault, Critical]
 *                       type:
 *                         type: string
 *                         enum: [Occured, Cleared, Active, Inactive]
 *                       time:
 *                         type: string
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update diagnostics data
 *     description: Updates device diagnostics and invalidates Redis cache. Requires authentication.
 *     tags: [Diagnostics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PortStatistics:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Updated diagnostics data
 *       404:
 *         description: Diagnostics not found
 *       500:
 *         description: Failed to update diagnostics
 *
 *   post:
 *     summary: Add new diagnostic entry
 *     description: Adds a new port statistic entry to diagnostics. Requires authentication.
 *     tags: [Diagnostics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *               description:
 *                 type: string
 *               channel:
 *                 type: string
 *               severity:
 *                 type: string
 *               type:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Diagnostic entry added successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Failed to add diagnostic entry
 *
 *   delete:
 *     summary: Clear all diagnostics
 *     description: Clears all port statistics. Requires authentication.
 *     tags: [Diagnostics]
 *     responses:
 *       200:
 *         description: Diagnostics cleared successfully
 *       404:
 *         description: Diagnostics not found
 *       500:
 *         description: Failed to clear diagnostics
 */

const Diagnostics = require('../models/diagnostics')
const { cacheGet, cacheSet, client } = require('../utils/redisClient')

const CACHE_KEY = 'diagnostics'

// GET /api/diagnostics
const getDiagnostics = async (req, res) => {
  try {
    // Check cache first
    const cached = await cacheGet(CACHE_KEY)
    if (cached) {
      return res.json(cached)
    }

    // Query database - get the first (and should be only) document
    let diagnostics = await Diagnostics.findOne({})

    // If no diagnostics exist, create default empty one
    if (!diagnostics) {
      diagnostics = new Diagnostics({
        PortStatistics: []
      })
      await diagnostics.save()
    }

    const response = {
      PortStatistics: diagnostics.PortStatistics
    }

    // Cache the result
    await cacheSet(CACHE_KEY, response, 300) // Cache for 5 minutes

    res.json(response)
  } catch (error) {
    console.error('❌ Error getting diagnostics:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: error.message,
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// PUT /api/diagnostics - Update entire diagnostics
const updateDiagnostics = async (req, res) => {
  try {
    let diagnostics = await Diagnostics.findOne({})

    if (!diagnostics) {
      return res.status(404).json({
        title: 'Not Found',
        detail: 'Diagnostics not found',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found',
        status: 404
      })
    }

    // Update PortStatistics
    if (req.body.PortStatistics) {
      diagnostics.PortStatistics = req.body.PortStatistics
    }

    const updated = await diagnostics.save()

    // Invalidate cache
    await client.del(CACHE_KEY)

    const response = {
      PortStatistics: updated.PortStatistics
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Failed to update diagnostics:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to update diagnostics',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// POST /api/diagnostics - Add new diagnostic entry
const addDiagnosticEntry = async (req, res) => {
  try {
    let diagnostics = await Diagnostics.findOne({})

    if (!diagnostics) {
      diagnostics = new Diagnostics({
        PortStatistics: []
      })
    }

    // Validate required fields
    const { key, description, severity, type } = req.body
    if (!key || !description || !severity || !type) {
      return res.status(400).json({
        title: 'Bad Request',
        detail: 'Missing required fields: key, description, severity, type',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request',
        status: 400
      })
    }

    // Add new entry
    diagnostics.PortStatistics.push(req.body)
    const updated = await diagnostics.save()

    // Invalidate cache
    await client.del(CACHE_KEY)

    const response = {
      PortStatistics: updated.PortStatistics
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('❌ Failed to add diagnostic entry:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to add diagnostic entry',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// DELETE /api/diagnostics - Clear all diagnostics
const deleteDiagnostics = async (req, res) => {
  try {
    let diagnostics = await Diagnostics.findOne({})

    if (!diagnostics) {
      return res.status(404).json({
        title: 'Not Found',
        detail: 'Diagnostics not found',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found',
        status: 404
      })
    }

    // Clear all entries
    diagnostics.PortStatistics = []
    const updated = await diagnostics.save()

    // Invalidate cache
    await client.del(CACHE_KEY)

    const response = {
      PortStatistics: updated.PortStatistics
    }

    res.json(response)
  } catch (error) {
    console.error('❌ Failed to clear diagnostics:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to clear diagnostics',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

module.exports = {
  getDiagnostics,
  updateDiagnostics,
  addDiagnosticEntry,
  deleteDiagnostics
}