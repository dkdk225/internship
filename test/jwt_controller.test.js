const {JWTController} = require('../jwt_controller')


test('should retrive payload correctly from token', ()=>{
  const payload = {id: 'userid', test: 'test'}
  const token = JWTController.generateJWT(payload)
  const resolvedPayload = JWTController.validateJWT(token)
  for (const key of Object.keys(payload)) {
    expect(payload[key]).toBe(resolvedPayload[key])
  }
})


