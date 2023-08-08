const {createCipheriv, createDecipheriv, randomBytes} = require('node:crypto')
const {encryption} = require('../config')
const {secretKey} = encryption

function encrypt(data){
    const iv = randomBytes(12).toString('utf-8')

    const cipher = createCipheriv('aes-256-gcm', secretKey, iv)
    let encryptedPayload = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()])
    const authTag = cipher.getAuthTag()
    return {
        encryptedPayload: encryptedPayload.toString('hex'),
        iv: iv,
        authTag: authTag.toString('hex')
    }
}

function decrypt({encryptedPayload, iv, authTag}){

    const decipher = createDecipheriv('aes-256-gcm', secretKey, iv)
    decipher.setAuthTag(authTag, 'hex')
    const decryptedPayload = Buffer.concat([decipher.update(encryptedPayload, 'hex'), decipher.final()]);
    
    return decryptedPayload
}


//outputs an object containing encyrpt and decrypt method


module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}

