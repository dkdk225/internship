const {index, login} = require('./router')
const {set} = require('./middleware')
const express = require('express')
const mqtt = require('mqtt')

const {port} = require('./config')
const app = express()
//-------- MIDDLEWARE------------

app.use(express.urlencoded({extended:true}))
//add root path to request
app.use(set('rootDirname', __dirname))
//add routers
app.use('/', index)
app.use('/login', login)



app.listen(port, ()=>{})