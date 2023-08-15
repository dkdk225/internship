const mqtt = require('mqtt')
const {mqttUser} = require('../config');
const MqttManager = require('./MqttManager');



module.exports = {
    mqtt:mqtt.connectAsync(
        mqttUser.url,
        {
            username:mqttUser.username,
            password:mqttUser.password
        }    
    ),
    MqttManager: MqttManager
}