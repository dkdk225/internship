const { MqttManager } = require("../mqtt");
const mqtt = require("mqtt");

test("should throw error when initialization fails", () => {
  const falseConfig = {
    url: "doesnt exist",
    username: "null",
    password: " ",
    topic: "shouldn't matter",
  };
  expect(() => {
    const manager = new MqttManager(falseConfig);
  }).toThrow();
});

describe("manager functionalit", () => {
  //should listen correctly
  //should publish correctly
  //should get topic
  let client, manager, trueConfig, topic;
  beforeAll(() => {
    //this should be a config for devolopment NOT production
    trueConfig = {
      username: "antechbroker",
      password: "G$YL*VPuZx2-n-TD",
      url: "mqtt://broker.antech.com.tr",
      topic: "unit-testing-mqtt-manager",
    };
    const {username, password, url} = trueConfig
    client = mqtt.connect(url, { username, password });
    manager = new MqttManager(trueConfig);
    topic = trueConfig.topic
  });
  afterAll(()=>{
    client.end()
    manager.endConnection()
  })

  test("should have the topic and message correct when publishing", (done) => {
    const publish = "testing manager publish";

    client.on("message", (topic, message) => {
      //message is buffer
      try {
        expect(topic).toBe(topic);
        expect(message.toString()).toBe(publish);
        done();
        client.removeAllListeners();
      } catch (err) {
        done(err);
      }
    });
    client.subscribe(topic, (err) => {
      if (err) throw err;
      manager.publish(null, publish);
    });
  });

  test("should update the reference object when listening to a topic", (done) => {
    const publish = "testing manager listening";
    const ref = new Proxy(
      {},
      {
        set(target, property, value, receiver) {
          if (typeof value === "string") {
            try {
              target[property] = value;
              expect(value).toBe(publish);
              done();
              return true;
            } catch (err) {
              done(err);
              console.log(err);
              return true;
            }
          }
          const set = this.set;
          target[property] = new Proxy(value, { set: set });
          return true;
        },
      }
    );
    manager.listenMessage(ref);
    manager.subscribe().then((result)=>{
      client.publish(topic+"/test", publish, (err) => {
        if (err) throw err;
      });
    });
  });

  
});
