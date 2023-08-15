const secretKey = Symbol('secretKey')
class AES{
    //class that provides encription/decription functionality by using 'aes-256-gcm' algorithm
    //constructor takes in a secret key for encryption/decription and stores it privately
    constructor(key){
        this[secretKey] = key
    }

    encrypt(data){
        const iv = randomBytes(12).toString('utf-8')
        const cipher = createCipheriv('aes-256-gcm', this[secretKey], iv)
        let encryptedPayload = Buffer.concat([cipher.update(data, 'utf-8'), cipher.final()])
        const authTag = cipher.getAuthTag()
        return {
            encryptedPayload: encryptedPayload.toString('base64'),
            iv: iv,
            authTag: authTag.toString('base64')
        }
    }

    decrypt({encryptedPayload, iv, authTag}){
        const decipher = createDecipheriv('aes-256-gcm', this[secretKey], iv)
        decipher.setAuthTag(authTag, 'base64')
        const decryptedPayload = Buffer.concat([decipher.update(encryptedPayload, 'base64'), decipher.final()]);
        return decryptedPayload
    }
}

module.exports = AES