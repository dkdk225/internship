const mqtt = require("mqtt");
class MqttManager {
  #client;
  #topic;
  //Mqtt manager for a model instance
  constructor({ url, username, password, topic }) {
    this.#client = mqtt.connect(url, {
      username,
      password,
    });
    this.#topic = topic;
  }
  publish(topicExtension = null, message) {
    if (typeof message !== 'string') {
      JSON.stringify(message)
    }
    const topic = topicExtension
      ? `${this.#topic}/${topicExtension}`
      : this.#topic;
    this.#client.publish(topic, message, (err, obj) => {
      if (err) console.log(err);
    });
  }
  async subscribe() {
    const result = await this.#client.subscribeAsync(`${this.#topic}/+`) //only returns error
    return result
  }

  listenMessage(refObj) {
    this.#client.on('message', (path, message)=>{
        //create path 
        let branch = refObj
        const topicArray = path.split('/')
        const key = topicArray.pop()
        for (const topic of topicArray) {
            if (!branch[topic]) {
                branch[topic] = {}
            }
            branch = branch[topic]
        }
        branch[key] = message.toString('utf-8')
        console.log('==============================')
        console.log(refObj)
    })
  }
  getTopic() {
    return this.#topic;
  }
  endConnection() {
    this.#client.end((err) => {
      if (err) console.log(err);
    });
  }
}

module.exports = MqttManager;
