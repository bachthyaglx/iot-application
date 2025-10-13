/* eslint-disable linebreak-style */
// ./src/controllers/maintenanceController.js

/**
 * @swagger
 * tags:
 *   - name: Maintenance
 *     description: Device maintenance operations and IODD catalog
 *
 * /api/maintenance:
 *   get:
 *     summary: Get maintenance information
 *     description: Returns maintenance links, digital twin info, and IODD catalog. Data is cached in Redis.
 *     tags: [Maintenance]
 *     responses:
 *       200:
 *         description: Maintenance data including links and IODD catalog
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 digitaltwin:
 *                   type: object
 *                   properties:
 *                     forms:
 *                       type: array
 *                       items:
 *                         type: object
 *                 backup_restore:
 *                   type: object
 *                 factorysettings:
 *                   type: object
 *                 firmware_update:
 *                   type: object
 *                 iodd_catalog:
 *                   type: object
 *                   properties:
 *                     ethIpv4:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update maintenance data
 *     description: Updates maintenance configuration. Requires authentication.
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated maintenance data
 *       404:
 *         description: Maintenance not found
 *       500:
 *         description: Failed to update maintenance
 *
 * /api/maintenance/reboot:
 *   post:
 *     summary: Reboot device
 *     description: Triggers device reboot. Requires authentication.
 *     tags: [Maintenance]
 *     responses:
 *       200:
 *         description: Reboot initiated successfully
 *       500:
 *         description: Failed to initiate reboot
 *
 * /api/maintenance/factorysettings:
 *   post:
 *     summary: Reset to factory settings
 *     description: Resets device to factory settings. Requires authentication.
 *     tags: [Maintenance]
 *     responses:
 *       200:
 *         description: Factory reset initiated successfully
 *       500:
 *         description: Failed to initiate factory reset
 *
 * /api/maintenance/fwupdate:
 *   post:
 *     summary: Update firmware
 *     description: Initiates firmware update process. Requires authentication.
 *     tags: [Maintenance]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firmware:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Firmware update initiated successfully
 *       400:
 *         description: Invalid firmware file
 *       500:
 *         description: Failed to initiate firmware update
 */

const Maintenance = require('../models/maintenance')
const { cacheGet, cacheSet, client } = require('../utils/redisClient')

const CACHE_KEY = 'maintenance'

// GET /api/maintenance
const getMaintenance = async (req, res) => {
  try {
    // Check cache first
    const cached = await cacheGet(CACHE_KEY)
    if (cached) {
      return res.json(cached)
    }

    // Query database
    let maintenance = await Maintenance.findOne({})

    // If no maintenance data exists, create default
    if (!maintenance) {
      maintenance = new Maintenance({
        digitaltwin: { forms: [] },
        backup_restore: { links: [] },
        factorysettings: { links: [] },
        firmware_update: { links: [] },
        iodd_catalog: { ethIpv4: [] }
      })
      await maintenance.save()
    }

    const response = maintenance.toJSON()

    // Cache the result
    await cacheSet(CACHE_KEY, response, 300) // Cache for 5 minutes

    res.json(response)
  } catch (error) {
    console.error('❌ Error getting maintenance:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: error.message,
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// PUT /api/maintenance - Update maintenance data
const updateMaintenance = async (req, res) => {
  try {
    let maintenance = await Maintenance.findOne({})

    if (!maintenance) {
      return res.status(404).json({
        title: 'Not Found',
        detail: 'Maintenance not found',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-404-not-found',
        status: 404
      })
    }

    // Update maintenance data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        maintenance[key] = req.body[key]
      }
    })

    const updated = await maintenance.save()

    // Invalidate cache
    await client.del(CACHE_KEY)

    res.json(updated.toJSON())
  } catch (error) {
    console.error('❌ Failed to update maintenance:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to update maintenance',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// POST /api/maintenance/reboot - Reboot device
const rebootDevice = async (req, res) => {
  try {
    // TODO: Implement actual reboot logic
    // This would typically involve system-level commands
    console.log('🔄 Reboot initiated...')

    res.json({
      message: 'Reboot initiated successfully',
      status: 'pending',
      timestamp: new Date().toISOString()
    })

    // In production, you would execute reboot command here
    // e.g., exec('sudo reboot')
  } catch (error) {
    console.error('❌ Failed to initiate reboot:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to initiate reboot',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// POST /api/maintenance/factorysettings - Reset to factory settings
const resetFactorySettings = async (req, res) => {
  try {
    // TODO: Implement actual factory reset logic
    console.log('🏭 Factory reset initiated...')

    res.json({
      message: 'Factory reset initiated successfully',
      status: 'pending',
      timestamp: new Date().toISOString(),
      warning: 'All settings will be reset to factory defaults'
    })

    // In production, clear all collections and reset to defaults
    // await Configuration.deleteMany({})
    // await seedConfigurationData()
  } catch (error) {
    console.error('❌ Failed to initiate factory reset:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to initiate factory reset',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

// POST /api/maintenance/fwupdate - Firmware update
const updateFirmware = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file && !req.body.firmwareUrl) {
      return res.status(400).json({
        title: 'Bad Request',
        detail: 'No firmware file provided',
        type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-400-bad-request',
        status: 400
      })
    }

    // TODO: Implement actual firmware update logic
    console.log('⚙️ Firmware update initiated...')

    const firmwareInfo = req.file ? {
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    } : {
      url: req.body.firmwareUrl
    }

    res.json({
      message: 'Firmware update initiated successfully',
      status: 'pending',
      timestamp: new Date().toISOString(),
      firmware: firmwareInfo,
      warning: 'Device will restart after update completes'
    })

    // In production, validate firmware and apply update
    // This would involve:
    // 1. Validate firmware file
    // 2. Backup current firmware
    // 3. Apply new firmware
    // 4. Restart device
  } catch (error) {
    console.error('❌ Failed to initiate firmware update:', error)
    res.status(500).json({
      title: 'Internal Server Error',
      detail: 'Failed to initiate firmware update',
      type: 'https://www.rfc-editor.org/rfc/rfc9110.html#name-500-internal-server-error',
      status: 500
    })
  }
}

module.exports = {
  getMaintenance,
  updateMaintenance,
  rebootDevice,
  resetFactorySettings,
  updateFirmware
}