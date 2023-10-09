const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../model/user')
beforeEach( async () => {await User.deleteMany()})
test('Should signup a new user', async () => {
    const response = await request(app).post('/register')
        .send({
            name:"dhriti",
            email:"dhriti@test.com",
            password:"1234567890"
        })
        .expect(201)
    const user = await User.findOne({email:"dhriti@test.com"})
    expect(response.body.message).toBeDefined()
    expect(user.password).not.toBe('1234567890')
})


test('Should login a new user', async () => {
    const response = await request(app).post('/login')
        .send({
            email:"dhriti@test.com",
            password:"1234567890"
        })
    const token = response.body.token
    const decoded = jwt.decode(token)
    expect(response.body.message).toBeDefined()
    expect(decoded.email).toBe('dhriti@test.com')
    expect(decoded.iat).toBeDefined()
})