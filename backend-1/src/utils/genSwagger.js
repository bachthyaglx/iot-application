/* eslint-disable linebreak-style */
const fs = require('fs')
const path = require('path')
const swaggerJsdoc = require('swagger-jsdoc')
const yaml = require('js-yaml')

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'IoT API', version: '1.0.0' },
  },
  apis: ['./src/controllers/*.js'],
}

const swaggerSpec = swaggerJsdoc(options)

const outputJsonPath = path.resolve(__dirname, 'src', 'open-api', 'swagger.json')
const outputYamlPath = path.resolve(__dirname, 'src', 'open-api', 'swagger.yaml')

// Ensure the output directory exists
fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true })

fs.writeFileSync(outputJsonPath, JSON.stringify(swaggerSpec, null, 2))
fs.writeFileSync(outputYamlPath, yaml.dump(swaggerSpec))

console.log('✅ Swagger docs generated in ./src/open-api/')
