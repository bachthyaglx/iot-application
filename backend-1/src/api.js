/* eslint-disable linebreak-style */
/* ./src/api.js */
const router = require('express').Router()
const middleware = require('./utils/middleware')
const auth = require('./controllers/authController')
const root = require('./controllers/rootController')
const picture = require('./controllers/pictureController')
const identification = require('./controllers/identificationController')
const ports = require('./controllers/portsController')
const diagnostics = require('./controllers/diagnosticsController')
const configuration = require('./controllers/configurationController')
const maintenance = require('./controllers/maintenanceController')
// const data = require('./controllers/dataController')

// Public routes - NO need token
router.get('/', middleware.tokenExtractor, middleware.optionalUserExtractor, root.getRoot)
router.get('/picture', picture.getPicture)
router.get('/identification', identification.getIdentification)
router.get('/device/ports', middleware.tokenExtractor, middleware.optionalUserExtractor, ports.getAllDevicePorts)
router.get('/device/port/:portId', middleware.tokenExtractor, middleware.optionalUserExtractor, ports.getDevicePort)
router.get('/diagnostics', middleware.tokenExtractor, middleware.optionalUserExtractor, diagnostics.getDiagnostics)
router.get('/configuration', middleware.tokenExtractor, middleware.optionalUserExtractor, configuration.getConfiguration)
router.get('/maintenance', middleware.tokenExtractor, middleware.optionalUserExtractor, maintenance.getMaintenance)
// router.get('/data', middleware.tokenExtractor, middleware.optionalUserExtractor, data.getRealTimeData)

// Protected routes - need token
router.put('/picture', middleware.tokenExtractor, middleware.userExtractor, picture.uploadMiddleware, picture.updatePicture)
router.put('/identification', middleware.tokenExtractor, middleware.userExtractor, identification.updateIdentification)
router.put('/device/port/:portId', middleware.tokenExtractor, middleware.userExtractor, ports.updateDevicePort)
router.put('/diagnostics', middleware.tokenExtractor, middleware.userExtractor, diagnostics.updateDiagnostics)
router.post('/diagnostics', middleware.tokenExtractor, middleware.userExtractor, diagnostics.addDiagnosticEntry)
router.delete('/diagnostics', middleware.tokenExtractor, middleware.userExtractor, diagnostics.deleteDiagnostics)
router.post('/configuration', middleware.tokenExtractor, middleware.userExtractor, configuration.createConfiguration)
router.patch('/configuration', middleware.tokenExtractor, middleware.userExtractor, configuration.updateConfiguration)
router.put('/maintenance', middleware.tokenExtractor, middleware.userExtractor, maintenance.updateMaintenance)
router.post('/maintenance/reboot', middleware.tokenExtractor, middleware.userExtractor, maintenance.rebootDevice)
router.post('/maintenance/factorysettings', middleware.tokenExtractor, middleware.userExtractor, maintenance.resetFactorySettings)
router.post('/maintenance/fwupdate', middleware.tokenExtractor, middleware.userExtractor, maintenance.updateFirmware)

// Auth routes
router.post('/login', auth.login)
router.post('/logout', auth.logout)

module.exports = router
