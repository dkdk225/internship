const jwt = require('jsonwebtoken')
const {encrypt, decrypt} = require('../encryption/encryption')
const {randomBytes} = require('node:crypto')


class JWTController {
    #tokens
    //stores encrypted secret keys in a map as token: key pair
    constructor(){
        this.#tokens = new Map()
    }

    generateJWT(payload){
        //generate key
        const secretKey = randomBytes(32)
        //generate jwt
        const token =  jwt.sign(payload, secretKey, {
            expiresIn: "1h"
        })
        //store encrypted jwt key in map
        this.#tokens.set(token, encrypt(secretKey))
        return token 
    }

    validateJWT(token){
        //get the secret key
        const encryptSecretKey = this.#tokens.get(token)
        if(!encryptSecretKey)
            throw Error('No such token')
        const secretKey = decrypt(encryptSecretKey)

        //validate jwt
        return jwt.verify(token, secretKey);
    }

    
}

module.exports = {
    JWTController: new JWTController()
}