const {Router} = require('express')

const path = require('path')


const index = Router({
    caseSensitive: true,

})

index.get('/',(req, res)=>{
    res.sendFile(
        'login.html',
        {
            root: path.join(req.rootDirname, 'views')
        }
    )
})

index.post('/',(req,res)=>{
    console.log(req.body)
    res.end()
})



module.exports = index