const {Model, Field} = require('../model')
const mqtt = require('mqtt')

//Model has implementation to close the mqtt connection
//therefore it causes leaks in testing
let dict
class TestModel extends Model {
  static testField = new Field()
}
beforeAll(()=>{
  dict = {testField: {text:'object as a field in order to make the dictionary complex'}}
})

describe('Test object creation', () => {
  test('should create an object with given fields when Mode.create is called', ()=>{
    const result = TestModel.create(dict)
    for (const field of Object.keys(dict) ) {
      expect(dict[field]).toEqual(result[field])
    }
  })
})


describe('Test default field creation', () => {
  test('should create a timestamp with current time when field type is timestamp and no value given at creation', () => {
    class TimestapmModel extends Model {
      static creationTime = new Field('timestamp')
    }
    const timestamp = TimestapmModel.create()
    const creationTime = new Date(timestamp.creationTime).getTime()
    const currentTime = Date.now()
    expect(creationTime).toBeLessThan(currentTime)
    expect(creationTime).toBeGreaterThan(currentTime - 3000)
  })
})


describe('Test MQTT methods',()=>{
  test(`should publish the created object to ${TestModel.name}/[id] when publish is called`, (done)=>{
    trueConfig = {
      username: "antechbroker",
      password: "G$YL*VPuZx2-n-TD",
      url: "mqtt://broker.antech.com.tr",
    };
    const {username, password, url} = trueConfig
    const client = mqtt.connect(url, { username, password });
    client.on('message', (topic, message)=>{
      try {
        const path = topic.split('/')
        expect(path[0]).toBe(TestModel.name)
        expect(message.toString()).not.toBe('')
        client.end()
        done()
      } catch (err) {
        done(err)
      }
    })
    client.subscribe(`${TestModel.name}/+`,(err, granted)=>{
      if(err) console.log(err)
      console.log('subscribed')
      TestModel.create(dict).publishMQTT()
    })
  })
  
  
  test('should add to the ref object by decrypting the encrypted data it pushed when listeningMQTT',  (done) => {
    const refObj = {}
    const expected = {}
    
    TestModel.listenMQTT(refObj, ({refObj, path})=>{
      try {
        const [modelName, id] = path.split('/')
        expected[modelName] = {}
        expected[modelName][id] = dict
        expect(refObj).not.toBe({})
        expect(refObj).toEqual(expected)
        done()
      } catch (err) {
        done(err)
      }
      
    }).then(()=>{
      return TestModel.create(dict).publishMQTT()
    })
  })

})

