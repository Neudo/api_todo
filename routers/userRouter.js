const express = require('express')
const {checkIfLogged, bookSlot, showSlots} = require ('../controllers/userControllers')
exports.router = (()=>{
    const authRouter = express.Router()
    authRouter.route('/book/:id').put( checkIfLogged )
    authRouter.route('/showAllSlots').get( checkIfLogged)
    return authRouter
})()


