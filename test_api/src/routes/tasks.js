const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// Model
const TaskModel = require('../models/task')
const UserModel = require('../models/user')
const ProjectModel = require('../models/project')
// Utilities
const Evaluate = require('../utilities/evaluate')
const DateUtils = require('../utilities/dates')

/**
 * TODO: API Task
 */

router.post('/add', Evaluate.eval_new_task, async (req, res) => {
    saveTask(req.body, res)
})

async function saveTask(task_info, res) {

    const { user_id, task_name, task_hours, task_min, task_sec, task_mode, projectId } = task_info;
    let timestamp = DateUtils.getLocalDate(new Date())

    let task_data = {
        name: task_name,
        mode: task_mode,
        durationHours: task_hours,
        durationMinutes: task_min,
        durationSeconds: task_sec,
        createdAt: timestamp,
        updatedAt: timestamp
    }

    //let finishDate = new Date(timestamp.getTime());

    //finishDate.setHours(finishDate.getHours() + task_hours)
    //finishDate.setMinutes(finishDate.getMinutes() + task_min)
    //finishDate.setSeconds(finishDate.getSeconds() + task_sec)
    //task_data.finishDate = finishDate
    let projectObject 
    if(projectId){
        projectObject = await ProjectModel.findOne({ _id: mongoose.Types.ObjectId(projectId) })
        task_data.project = mongoose.Types.ObjectId(projectId)
    }

    UserModel.findOne({ id: user_id }).then((userExists) => {
        if (!userExists) {
            res.status(501).send({
                message: 'User not exist'
            })
            return
        }

        task_data.owner = mongoose.Types.ObjectId(userExists._id)

        const newTask = new TaskModel(task_data)
        
        newTask.save().then((savedTask) => {
            userExists.tasks.push(savedTask)
            userExists.save().then(() => {
                if(projectObject){
                    projectObject.tasks.push(savedTask)
                    projectObject.save().then(() => {
                        res.send({
                            task: savedTask,
                            message: 'The task has been registered [into project]'
                        })
                    }).catch(err => {
                        res.status(501).send({
                            message: err.Error
                        })
                        return
                    })
                    return
                }
                res.send({
                    task: savedTask,
                    message: 'The task has been registered'
                })
            }).catch(err => {
                res.status(501).send({
                    message: err.Error
                })
                return
            })
        }).catch(err => {
            res.status(501).send({
                message: err.Error
            })
            return
        })
    })
}

router.post('/continue', Evaluate.eval_continue_task, async (req, res) => {
    const { user_id, task_id, task_hours, task_min, task_sec } = req.body;

    TaskModel.findOne({ _id: mongoose.Types.ObjectId(task_id) }).then((userTask) => {
        //const { user_id, task_name, task_hours, task_min, task_sec, task_mode, projectId } = task_info;
        let task_info = {
            user_id,
            task_name: userTask.name,
            task_hours,
            task_min,
            task_sec,
            task_mode: userTask.mode,
            projectId: userTask.project
        }

        saveTask(task_info, res)

    }).catch(err => {
        res.status(501).send({
            message: err.Error
        })
        return
    })
})

router.get('/', Evaluate.eval_get_task, async (req, res) => {
    
    const user_id = req.query.userId;

    UserModel.findOne({ id: user_id }).then((userExists) => {
        if (!userExists) {
            res.status(501).send({
                message: 'User not exist'
            })
            return
        }

        TaskModel.find({ owner: { $in: [userExists._id] } }).sort({"createdAt": -1}).then((userTasks) => {
            res.send({
                task: userTasks
            })
        }).catch(err => {
            res.status(501).send({
                message: err.Error
            })
            return
        })
        
    }).catch(err => {
        res.status(501).send({
            message: err.Error
        })
        return
    })
    
})

module.exports = router