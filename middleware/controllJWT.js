const {JWTController} = require('../jwt_controller')
module.exports = function () {
    return (req, res, next)=>{
        req.jwt = false
        const auth = req.get('Authorization')
        try {
            const token = auth.substring(7)
            if(JWTController.validateJWT(token))
                req.jwt = true
        } catch (error) {
            console.log("ERROR at jwt controll")
            console.log(error)
        }
        next()
    }
}