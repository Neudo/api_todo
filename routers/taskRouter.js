const express = require('express')
const {checkIfLogged,newTask, editTask, showTasksInProgress, deleteTask} = require ('../controllers/taskControllers')
exports.router = (()=>{
    const taskRouter = express.Router()
    taskRouter.route('/task/create').post( checkIfLogged, newTask )
    taskRouter.route('/task/:id').put( checkIfLogged, editTask )
    taskRouter.route('/task/progress').get( checkIfLogged, showTasksInProgress)
    taskRouter.route('/task/:id').delete( checkIfLogged, deleteTask)
    return taskRouter
})()


