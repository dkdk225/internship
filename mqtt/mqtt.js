const mqtt = require('mqtt')
const {mqttUser} = require('../config')
module.exports = mqtt.connectAsync(
    mqttUser.url,
    {
        username:mqttUser.username,
        password:mqttUser.password
    }    
);