const NodeGeocoder = require('node-geocoder')
const dotenv = require('dotenv')
dotenv.config({ path: '../config/config.env'})
const options = {
    provider : 'mapquest',
    httpAdapter: 'https',
    apiKey: 'RTloqk4U9pHywMjggQxzLSH3DgAZYAsb',
    formatter : null
}

const geocoder = NodeGeocoder(options)

module.exports = geocoder