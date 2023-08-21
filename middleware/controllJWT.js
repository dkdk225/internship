const {JWTController} = require('../jwt_controller')
module.exports = function () {
    return (req, res, next)=>{
        req.jwt = false
        req.jwtSender = null
        const auth = req.get('Authorization')
        try {
            const token = auth.substring(7)
            const sender = JWTController.validateJWT(token)
            if(sender){
                req.jwt = true
                req.jwtSender = sender
            }
        } catch (error) {
            console.log("ERROR at jwt controll")
            console.log(error)
        }
        next()
    }
}