const {Router} = require('express')
const {JWTController} = require('../jwt_controller')

const path = require('path')


const login = Router({
    caseSensitive: true,

})

login.get('/',(req, res)=>{
    res.sendFile(
        'login.html',
        {
            root: path.join(req.rootDirname, 'views')
        }
    )
})

login.post('/',(req,res)=>{
    const jwt = JWTController.generateJWT(req.body)
    res.send(jwt)
})



module.exports = login