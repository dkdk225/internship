const {Router} = require('express')
const {decrypt} = require('../encryption')
const {publicEncrypt} = require('node:crypto')
const {encryption} = require('../config')
const {secretKey} = encryption
const {mqtt} = require('../mqtt')
const messages = {

}

mqtt.then(broker=>{
    broker.on("message", (path, encryptMessage) => {
        // encryptMessage is Buffer
        //path is mqtt topic
        //the topic program refers to is wrapped in path(mqtt topic)
      
        //dismantle the path
        const [header, encryptTopic, id] = path.split('/')
        const message = decrypt(JSON.parse(encryptMessage.toString('utf-8'))).toString('utf-8');
        const topic = decrypt(JSON.parse(encryptTopic)).toString('utf-8');
        if(messages[header] == undefined)
            messages[header] = {}
        if(messages[header][topic] == undefined)
            messages[header][topic] = {}
        messages[header][topic][id] = encryptMessage.toString('utf-8')
      });
})



const admin = Router({
    caseSensitive: true,
})
admin.get('/:header/:topic', (req, res)=>{
    if(req.jwt){
        const {header, topic} = req.params
        console.log(messages)
        res.send(JSON.stringify(messages[header][topic]))
    }
    else
        res.status(403).send('forbidden')
    
})

admin.get('/key', (req, res)=>{
    const {publicKey} = req.query
    const encrypted = publicEncrypt(publicKey, secretKey).toString('base64')
    res.send(encrypted)
})



module.exports = admin