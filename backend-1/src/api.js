/* eslint-disable linebreak-style */
const router = require('express').Router()
const middleware = require('./utils/middleware')
const root = require('./controllers/rootController')
const picture = require('./controllers/pictureController')
const info = require('./controllers/deviceInfoController')
const data = require('./controllers/dataController')
const auth = require('./controllers/authController')

// Public GET routes
router.get('/', middleware.userExtractor, root.getRoot)
router.get('/picture', picture.getPicture)
router.get('/information', info.getInformation)
router.get('/data', middleware.userExtractor, data.getRealTimeData)

// Protected PUT routes
router.put('/picture', middleware.userExtractor, picture.updatePicture)
router.put('/information', middleware.userExtractor, info.updateDevice)

// Auth routes
router.post('/login', auth.login)
router.post('/logout', auth.logout)

module.exports = router
