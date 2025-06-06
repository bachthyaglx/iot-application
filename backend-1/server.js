/* eslint-disable no-trailing-spaces */
/* eslint-disable linebreak-style */
// ./server.js
const express = require('express')
const app = express()
require('express-async-errors')
require('module-alias/register')
const cors = require('cors')
const logger = require('@/utils/logger')
const config = require('@/utils/config')
const middleware = require('@/utils/middleware')
const apiRouter = require('@/api')
const connectToMongo = require('@/utils/mongo')

// START Swagger setup
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const fs = require('fs')
const yaml = require('js-yaml')
const swaggerOptions = require('./src/utils/swaggerOptions')

// 🔁 Auto-generate Swagger on dev startup
const swaggerSpec = swaggerJSDoc(swaggerOptions)
fs.writeFileSync('./src/open-api/swagger.json', JSON.stringify(swaggerSpec, null, 2))
fs.writeFileSync('./src/open-api/swagger.yaml', yaml.dump(swaggerSpec))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
// END Swagger setup

// Connect to MongoDB
connectToMongo()

app.use(cors())
app.use(express.static('dict'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api', apiRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

module.exports = app
