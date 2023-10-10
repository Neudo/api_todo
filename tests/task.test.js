const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../app')
const Task = require('../model/task')


test('Should create a new task', async () => {
    const response = await request(app).post('/task/create')
        .send({
            title: "test",
            description: "test"
        })
        .expect(201)
    const token = response.body.token
    const decoded = jwt.decode(token);
    const userId = decoded.userId
    const user = await User.findById(userId)
    expect(response.body.message).toBeDefined()
    expect(user.tasks.length).toBe(1)
    expect(user.tasks[0].title).toBe("test")

})