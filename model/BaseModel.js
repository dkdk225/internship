const { MqttManager } = require("../mqtt");
const Field = require("./Field");
const { mqttUser } = require("../config");
const { v4: uuidv4 } = require("uuid");
const { AES } = require("../encryption");
const { randomBytes } = require("node:crypto");

const mqtt = Symbol("mqtt");
const keys = Symbol("keys");
const connectMQTT = Symbol('connectMQTT')
const encrypt = Symbol('encrypt')
const decrypt = Symbol('decrypt')
const generateDefaultObject = Symbol('generateDefaultObject')

class BaseModel {
  //manager for created datatype
  //model class=>(manages)=>declared instances in model
  //SERVICES
  //creates a model
  //publishes a model
  //subscribes to model topic
  //listens to model topic (has on update function)
  constructor() {
    throw new Error(
      "Cannot instantiate abstract class: " + this.constructor.name
    );
  }
  static create(dict={}) {
    //returns an instance of declared structure attaching data managemet methods such as
    //publishMQTT

    this[connectMQTT]()
    if (!this[keys]) {
      this[keys] = {};
    }
    this.validateModelDict(dict);
    //setup object
    const id = uuidv4();// id should not generate with each publish therefore it's outside of the scope
    const object = this[generateDefaultObject]()
    Object.assign(object, {...dict})
    object.publishMQTT = async () => {
      const encryptedObjJSON = this[encrypt](id, object)
      await this[mqtt].publish(id, JSON.stringify(encryptedObjJSON));
    };
    return object;
  }

  static validateModelDict(dict) {
    //model should only contain keys mentioned in fields
    //model can contain less fields than mentioned
    //model values cannot be functions
    const fields = Object.keys(this).filter(
      (field) => this[field] instanceof Field
    );

    const keys = Object.keys(dict);
    for (const key of keys) {
      if (!fields.includes(key)) {
        throw new Error("Mismatching dictionary and fields at model");
      }
    }
  }

  static async listenMQTT(obj) {
    this[connectMQTT]()
    //obj is an empty ref which gets updated on new message
    this[mqtt].subscribe();
    if (JSON.stringify(obj) !== JSON.stringify({})) {
      throw TypeError (`${this.name} listenMQTT method must take in an empty object reference`)
    }
    const callerClass = this
    const proxyObj = new Proxy(obj, {
      set(target, property, value, receiver) {
        if (value === '') {
          //delete value
          delete target[property]
          return true
        }
        else if ( typeof value === 'string' ) {
          target[property] = callerClass[decrypt](property, value)
          return true
        }
        //using Reflect.setPrototypeOf(value, proxyObj) may be more efficient but 
        //due to my lack of knowledge about prototypes I've decided to use this method
        const set = this.set
        target[property] = new Proxy(value, {set:set})
        return true
      }
    })
    await this[mqtt].listenMessage(proxyObj);
  }

}
BaseModel[connectMQTT] = function() {
  if (!this[mqtt]) {
    this[mqtt] = new MqttManager({ ...mqttUser, topic: this.name });
  }
}
BaseModel[encrypt] = function(id, data) {
  this[keys][id] = randomBytes(32);
  return new AES(this[keys][id]).encrypt(
    JSON.stringify(data)
  );
}

BaseModel[decrypt] = function(id, data) {
  const buffer = new AES(this[keys][id]).decrypt(JSON.parse(data))
  delete this[keys][id]
  return JSON.parse(buffer.toString('utf-8'))
}

BaseModel[generateDefaultObject] = function() {
  const fields = Object.keys(this).filter(
    (field) => this[field] instanceof Field
  );
  const object = {};
  for (const field of fields) {
    object[field] = this[field].default()
  }
  return object
}

module.exports = BaseModel;