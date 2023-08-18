const create = {
  timestamp: () => {
    return new Date().toString()
  }
}

class Field {
  constructor(type=null){
    this.type = type
  }
  default() {
    if (create[this.type])
      return create[this.type]()
    return null
  }
}

module.exports = Field