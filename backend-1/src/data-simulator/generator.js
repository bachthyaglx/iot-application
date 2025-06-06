/* eslint-disable indent */
/* eslint-disable linebreak-style */
// ./src/sensor-simulator/generator.js
function generateValue(type) {
  switch (type) {
    case 'temperature': return +(20 + Math.random() * 10).toFixed(2)
    case 'voltage': return +(220 + Math.random() * 5).toFixed(2)
    case 'humidity': return +(40 + Math.random() * 20).toFixed(2)
    default: return 0
  }
}

module.exports = { generateValue }
