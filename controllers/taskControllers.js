require('dotenv').config()
const {DB_USER, DB_PASSWORD, DB_NAME, API_KEY} = process.env
const Task = require('../model/task')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const {logIn} = require("./authControllers");

module.exports = {

    checkIfLogged(req, res, next){
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader){
            const message = "Vous n'avez pas fournis de jeton. Ajoutez en un de l'en-tête de la requète."
            return res.status(401).json({message})
        }
        else {
            const token = authorizationHeader.split(' ')[1];
            jwt.verify(token, 'RANDOM_TOKEN_SECRET', (err, decoded) => {
                if (err) {
                    console.error('Erreur de vérification du jeton:', err);
                    return res.status(401).json({ message: 'Erreur de vérification du jeton' });
                } else {
                    req.userId = decoded.userId;
                    next();
                }
            });
        }
    },
    newTask(req,res) {
        const userId = req.userId
        const task = new Task({
            ...req.body,
            userId: userId
        })
        const error = []

        if(req.body.title.length <= 0){
            console.error.push('Merci de rentrer un titre.')
        }

        if(error.length <= 0) {
            task.save()
                .then(()=> res.status(201).json({message: 'Tâche ajoutée !'}))
                .catch(error => res.status(401).json({error: error}))
        } else {
            return res.status(401).json({
                success: false,
                errors: error
            })
        }


    },
    showAllTasks(req,res){
        const userId = req.userId;
        Task.find({ userId: userId })
            .then(tasks => {
                req.userTasks = tasks;
                const jsonResponse = { tasks: tasks };
                res.status(200).json(jsonResponse);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des tâches de l'utilisateur:", error);
                res.status(500).json({ message: "Error 500" });
            });
    },
    deleteTask(req, res){
        const taskId = req.params.id; // Récupère l'ID de la tâche depuis les paramètres d'URL

        // Vérifiez si la tâche existe
        Task.findOne({ _id: taskId, userId: req.userId })
            .then(task => {
                if (!task) {
                    return res.status(404).json({ message: "Tâche non trouvée" });
                }

                // Supprimez la tâche
                task.deleteOne()
                    .then(() => {
                        res.status(200).json({ message: "Tâche supprimée avec succès" });
                    })
                    .catch(error => {
                        console.error("Erreur lors de la suppression de la tâche:", error);
                        res.status(500).json({ message: "Erreur 500 lors de la suppression de la tâche" });
                    });
            })
            .catch(error => {
                console.error("Erreur lors de la recherche de la tâche:", error);
                res.status(500).json({ message: "Erreur 500 lors de la recherche de la tâche" });
            });
    },
    // Middleware pour modifier une tâche par son ID
    editTask(req, res) {
    const taskId = req.params.id; // Récupère l'ID de la tâche depuis les paramètres d'URL

    // Vérifiez si la tâche existe
    Task.findOne({ _id: taskId, userId: req.userId })
        .then(task => {
            if (!task) {
                return res.status(404).json({ message: "Tâche non trouvée" });
            }

            // Mettez à jour les propriétés de la tâche
            if (req.body.title) {
                task.title = req.body.title;
            }

            if (req.body.description) {
                task.description = req.body.description;
            }

            // Enregistrez les modifications de la tâche
            task.save()
                .then(() => {
                    res.status(200).json({ message: "Tâche modifiée avec succès", updatedTask: task });
                })
                .catch(error => {
                    console.error("Erreur lors de la modification de la tâche:", error);
                    res.status(500).json({ message: "Erreur 500 lors de la modification de la tâche" });
                });
        })
        .catch(error => {
            console.error("Erreur lors de la recherche de la tâche:", error);
            res.status(500).json({ message: "Erreur 500 lors de la recherche de la tâche" });
        });
}

}
