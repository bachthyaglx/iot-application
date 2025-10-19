/* eslint-disable linebreak-style */
const fs = require('fs')
const path = require('path')
const swaggerJsdoc = require('swagger-jsdoc')
const yaml = require('js-yaml')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT API',
      version: '1.0.0',
      description: 'API documentation for IoT Application'
    },
  },
  apis: ['./src/controllers/*.js', './src/api.js'],
}

const swaggerSpec = swaggerJsdoc(options)

// Navigate to project root first
const projectRoot = path.resolve(__dirname, '..', '..') // Go up 2 levels from src/utils
const outputJsonPath = path.join(projectRoot, 'src', 'open-api', 'swagger.json')
const outputYamlPath = path.join(projectRoot, 'src', 'open-api', 'swagger.yaml')

console.log('📁 Project root:', projectRoot)
console.log('📄 Output JSON path:', outputJsonPath)
console.log('📄 Output YAML path:', outputYamlPath)

// Ensure the output directory exists
const outputDir = path.dirname(outputJsonPath)
console.log('📁 Creating directory:', outputDir)
fs.mkdirSync(outputDir, { recursive: true })

// Write files
fs.writeFileSync(outputJsonPath, JSON.stringify(swaggerSpec, null, 2))
fs.writeFileSync(outputYamlPath, yaml.dump(swaggerSpec))

console.log('✅ Swagger docs generated successfully!')
console.log('   - JSON:', outputJsonPath)
console.log('   - YAML:', outputYamlPath)