const {createCipheriv, createDecipheriv, randomBytes} = require('node:crypto')
const AES = require('./AES')
const {encryption} = require('../config')
const {secretKey} = encryption

function encrypt(data){
    const iv = randomBytes(12).toString('utf-8')

    const cipher = createCipheriv('aes-256-gcm', secretKey, iv)
    let encryptedPayload = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()])
    const authTag = cipher.getAuthTag()
    return {
        encryptedPayload: encryptedPayload.toString('base64'),
        iv: iv,
        authTag: authTag.toString('base64')
    }
}

function decrypt({encryptedPayload, iv, authTag}){

    const decipher = createDecipheriv('aes-256-gcm', secretKey, iv)
    decipher.setAuthTag(authTag, 'base64')
    const decryptedPayload = Buffer.concat([decipher.update(encryptedPayload, 'base64'), decipher.final()]);
    
    return decryptedPayload
}


//outputs an object containing encyrpt and decrypt method


module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    AES: AES
}

