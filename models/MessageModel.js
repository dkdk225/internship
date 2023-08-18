const model = require('../model/')
class MessageModel extends model.Model{
    static text = new model.Field()
    static timestamp = new model.Field('timestamp')
}

module.exports = MessageModel