/* eslint-disable linebreak-style */
/* ./src/api.js */
const router = require('express').Router()
const middleware = require('./utils/middleware')
const root = require('./controllers/rootController')
const picture = require('./controllers/pictureController')
const info = require('./controllers/deviceInfoController')
const data = require('./controllers/dataController')
const auth = require('./controllers/authController')

// Public routes - NO need token
router.get('/', middleware.tokenExtractor, middleware.optionalUserExtractor, root.getRoot)
router.get('/picture', picture.getPicture)
router.get('/identification', info.getInformation)

// Protected routes - need token
router.put('/picture', middleware.tokenExtractor, middleware.userExtractor, picture.uploadMiddleware, picture.updatePicture)
router.put('/identification', middleware.tokenExtractor, middleware.userExtractor, info.updateDevice)
router.get('/data', middleware.tokenExtractor, middleware.optionalUserExtractor, data.getRealTimeData)

// Auth routes
router.post('/login', auth.login)
router.post('/logout', auth.logout)

module.exports = router
