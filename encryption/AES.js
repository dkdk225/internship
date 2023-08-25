const {createCipheriv, createDecipheriv, randomBytes} = require('node:crypto')
class AES{
    //class that provides encription/decription functionality by using 'aes-256-gcm' algorithm
    //constructor takes in a secret key for encryption/decription and stores it privately
    #secretKey
    constructor(key){// key => Buffer
        this.#secretKey = key// buffer => (in same format as iv either buffer or string)
    }

    encrypt(data){
        //data is a string to be encrypted
        // other type of variables should be typecasted into string before being given as an argument
        const iv = randomBytes(12)
        const cipher = createCipheriv('aes-256-gcm', this.#secretKey, iv)
        let encryptedPayload = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()])
        const authTag = cipher.getAuthTag()
        return {
            encryptedPayload: encryptedPayload.toString('base64'),//string => base64
            iv: iv.toString('base64'), //string => base64
            authTag: authTag.toString('base64')// string => base64
        }
    }

    decrypt({encryptedPayload, iv, authTag}){
        //incoming arguments should be in a format same as leaving arguments
        const decipher = createDecipheriv('aes-256-gcm', this.#secretKey, Buffer.from(iv, 'base64'))
        decipher.setAuthTag(authTag, 'base64')
        const decryptedPayload = Buffer.concat([decipher.update(encryptedPayload, 'base64'), decipher.final()]);
        return decryptedPayload
    }
}

module.exports = AES