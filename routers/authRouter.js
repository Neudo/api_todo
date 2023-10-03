const express = require('express')
const { newUser, logIn} = require ('../controllers/authControllers')
exports.router = (()=>{
    const authRouter = express.Router()

    authRouter.route('/register').post(newUser)
    authRouter.route('/login').post(logIn)
    return authRouter
})()

