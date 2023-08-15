const mqtt = require('mqtt')
const {mqttUser} = require('../config');
const {mqttUser} = require('../config')
module.exports = mqtt.connectAsync(



module.exports = {
    mqtt:mqtt.connectAsync(
        mqttUser.url,
        {
            username:mqttUser.username,
            password:mqttUser.password
        }    
    ),
);}
);