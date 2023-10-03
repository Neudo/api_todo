const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

exports.success = (message, data) => {
    return{message, data}
}
module.exports = {
    async newUser(req, res, next) {
        const userUuid = (uuidv4())

        await bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    name: req.body.name,
                    password: hash,
                    token: userUuid,
                })
                userEmail = user.email
                userName = user.name
                userToken = user.token
                userPassword = user.password

                const error = []
                const regexMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

                if ((userEmail.length <= 0) || (userName.length <= 0) || (userPassword.length <= 0)) {
                    error.push("Merci de remplire tous les champs !")
                }

                if (!regexMail.test(userEmail)) {
                    error.push("Merci d'entrer une adresse mail valide !")
                }

                User.findOne({email: req.body.email})
                    .then(user => {
                        if (user) {
                            return error.push("Email déjà utilisée !")
                        }
                    })


                if (error.length <= 0) {
                    user.save()
                        .then(() => res.status(201).json({message: 'Merci, votre compte à bien été créé.'}))
                        .catch(error => res.status(401).json({error}));
                }
            })
            .catch(error => res.status(402).json({error}));
    },
    logIn(req, res){
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
                }
                const username = user
                bcrypt.compare(req.body.password, user.password)

                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                        }
                        const token = jwt.sign(
                            { userId: user._id }, // Ajout de l'ID de l'utilisateur ici
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        );
                        const options = {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            }
                        };

                        res.status(200).json({
                            token,
                            message: `Bonjour ${user.name}`,
                            tasks: 'task list'

                        });
                    })
                    .catch(error => {
                        console.log("error test", error)
                        res.status(500).json({ message: "Error 500" });
                    })
            })
            .catch(error => res.status(500).json({ error }))
    }
}
