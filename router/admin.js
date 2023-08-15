const {Router} = require('express')
const {publicEncrypt} = require('node:crypto')
const {encryption} = require('../config')
const {secretKey} = encryption
const admin = Router({
    caseSensitive: true,
})

admin.get('/key', (req, res)=>{
    const {publicKey} = req.query
    const encrypted = publicEncrypt(publicKey, secretKey).toString('base64')
    res.send(encrypted)
})



module.exports = admin