/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
const info = (...params) => {
  console.log(...params)  
}

const error = (...params) => {    
  console.error(...params)  
}

module.exports = {
  info, error
}