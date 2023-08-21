const {Router} = require('express')
const {decrypt} = require('../encryption')
const {publicEncrypt} = require('node:crypto')
const {encryption} = require('../config')
const {secretKey} = encryption
const {mqtt} = require('../mqtt')
const {MessageModel} = require('../models')
const messages = {}

MessageModel.listenMQTT(messages)

const admin = Router({
    caseSensitive: true,
})

admin.get('/:header/:topic', (req, res)=>{

    if(req.jwt){
        const {header, topic} = req.params
        console.log(messages)
        res.send(JSON.stringify(messages[header]))
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