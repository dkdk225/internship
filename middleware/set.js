//middleware to set a key-value pair in request
module.exports = (key, value)=>{
    return (req, res, next)=>{
        if(req[key]) throw new TypeError('cannot set an already existing key-value pair')
        req[key] = value
        next()
    }
}