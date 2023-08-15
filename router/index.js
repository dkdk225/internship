const {Router} = require('express')
const {encrypt, decrypt} = require('../encryption')
const {mqtt} = require('../mqtt')
const { v4:uuidv4 } = require('uuid');
const path = require('path')
const index = Router({
    caseSensitive: true,

})



index.get('/',(req, res)=>{
    //set header values to tell browser document type
    // res.set('Content-Type', 'text/html; charset=UTF-8');
    // res.send('<h1>some html</h1>')
    res.sendFile(
        'index.html',
        {
            root: path.join(req.rootDirname, 'views')
        }
    )
})


index.post('/',(req,res)=>{
    const id = uuidv4();
    const {message, topic} = req.body
    const topicEncrypted = JSON.stringify(encrypt(topic))
    const messageEncrypted = JSON.stringify(encrypt(message))
    
    mqtt.then(broker => {
        broker.publish(
            `testing/${topicEncrypted}/${id}`,
            '',
            {
                qos:2
            },
            (err)=>{
                broker.subscribe(
                    `testing/${topicEncrypted}/+`,
                    (err, {topic, qos})=>{
                        console.log(err)
    
                    }
                )
    
                broker.publish(
                    `testing/${topicEncrypted}/${id}`,
                    messageEncrypted,
                    {
                        qos:2
                    },
                    (err)=>{
                        console.log(messageEncrypted)
                        res.send('published successfully')
                    }
                )
            }
        )
    })

        

})



module.exports = index