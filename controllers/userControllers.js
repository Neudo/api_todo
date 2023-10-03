require('dotenv').config()
const {DB_USER, DB_PASSWORD, DB_NAME, API_KEY} = process.env
const User = require('../model/user')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

module.exports = {

    checkIfLogged(req, res, next){
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader){
            const message = "Vous n'avez pas fournis de jeton. Ajoutez en un de l'en-tête de la requète."
            return res.status(401).json({message})
        }
        else {
            next()
        }
    },
}
