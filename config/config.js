const {readFileSync} = require('node:fs')
const mqttUser = require('./mqttUser.js')
const secretKey = readFileSync(__dirname+'/'+'encryption.json', 'utf-8')

module.exports = {
    mqttUser: mqttUser,
    encryption:JSON.parse(secretKey),
    port: 3000
}