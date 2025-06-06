/* eslint-disable linebreak-style */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT API',
      version: '1.0.0'
    },
    tags: [
      { name: 'Root', description: 'Thing metadata and entrypoint' },
      { name: 'Auth', description: 'User authentication' },
      { name: 'Device', description: 'Device information and metadata' },
      { name: 'Picture', description: 'Device image retrieval & cache' },
      { name: 'Sensor', description: 'Realtime or cached sensor data' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./src/controllers/*.js'] // Scan API docs
}

module.exports = options
