const {index, login, admin} = require('./router')
const {set, controllJWT} = require('./middleware')
const express = require('express')

const {port} = require('./config')
const app = express()
//-------- MIDDLEWARE------------
app.use('/admin', controllJWT())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
//Staticly serve files from public folder
app.use('/public', express.static(__dirname+'/public'))
//Add root path to request
app.use(set('rootDirname', __dirname))
//Add routers
app.use('/', index)
app.use('/login', login)
app.use('/admin', admin)


app.listen(port, ()=>{})