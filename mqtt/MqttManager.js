const topic = Symbol('topic')
const client = Symbol('client')
const req = Symbol('req')
const mqtt = require('mqtt')
class MqttManager{
    #client
    #topic
    #req
    //Mqtt manager for a model instance
    constructor({url, username, password, path}){
        this.#client = mqtt.connect(
            url,
            {
                username,
                password
            }    
        );
        this.#topic = path
        this.#req = []
    }
    publish(pathExtension=null, message){
        const path = pathExtension? `${this.#topic}/${pathExtension}`: this.#topic 
        this.#client.publish(path, message, (err, obj)=>{
            console.log(err)
        })
    }
    subscribe(){
        this.#client.subscribe(this.#topic, (err) => {
            console.log(err)
        })
    }
    getTopic(){
        return this.#topic
    }
}

module.exports = MqttManager