const express = require('express')
const {checkIfLogged,newTask, editTask, showAllTasks, deleteTask} = require ('../controllers/taskControllers')
exports.router = (()=>{
    const taskRouter = express.Router()
    taskRouter.route('/task/create').post( checkIfLogged, newTask )
    taskRouter.route('/task/:id').put( checkIfLogged, editTask )
    taskRouter.route('/me').get( checkIfLogged, showAllTasks)
    taskRouter.route('/task/:id').delete( checkIfLogged, deleteTask)
    return taskRouter
})()


