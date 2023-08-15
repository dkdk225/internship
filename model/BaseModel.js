const {MqttManager} = require('../mqtt')
class BaseModel{
    constructor(){
        mqtt: new MqttManager()
    }
}