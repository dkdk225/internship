const {Router} = require('express')
const {decrypt} = require('../encryption')
const {publicEncrypt, randomBytes} = require('node:crypto')
const {encryption} = require('../config')
const {secretKey} = encryption
const {mqtt} = require('../mqtt')
const {MessageModel} = require('../models')
const {AES} = require('../encryption')
const messages = {}
const connectionKeys = {}

MessageModel.listenMQTT(messages)

const admin = Router({
    caseSensitive: true,
})

admin.get('/', (req, res)=>{
    if(req.jwt){
        console.log('TOKEN SENDER', req.jwtSender)
        
        const {path} = req.query
        const encrypted = new AES(connectionKeys[req.jwtSender]).encrypt(JSON.stringify(messages[path]))
        res.send(encrypted)
    }
    else
        res.status(403).send('forbidden')
})

admin.get('/key', (req, res)=>{
    const key = randomBytes(32)
    console.log('key string', key.toString('utf-8'))
    console.log(secretKey)
    connectionKeys[req.jwtSender] = key
    const {publicKey} = req.query
    const encrypted = publicEncrypt(publicKey, key).toString('base64')
    res.send(encrypted)
})



module.exports = admin