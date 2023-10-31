const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../model/user')
afterAll( async () => {await User.deleteMany()})
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

describe('Login Endpoint', () => {
    it('should log in a user with valid credentials', async () => {
        const response = await request(app)
            .post('/login')
            .send({
                email: 'dhriti@test.com',
                password: '1234567890',
            });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        const decoded = jwt.decode(response.body.token);
        expect(decoded.userId).toBeDefined();
        expect(response.body.message).toBe("Bonjour dhriti");
    });
});
