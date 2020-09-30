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

router.post('/add', Evaluate.eval_new_project, async (req, res) => {
    const { user_id, project_name } = req.body;
    let timestamp = DateUtils.getLocalDate(new Date())

    let project_data = {
        name: project_name,
        createdAt: timestamp,
        updatedAt: timestamp
    }

    UserModel.findOne({ id: user_id }).then((userExists) => {
        if (!userExists) {
            res.status(501).send({
                message: 'User not exist'
            })
            return
        }

        project_data.owner = mongoose.Types.ObjectId(userExists._id)
        
        const projectTask = new ProjectModel(project_data)
        projectTask.save().then((savedProject) => {
            res.send({
                message: 'The project has been registered',
                project: savedProject
            })
        }).catch(err => {
            res.status(501).send({
                message: err.Error
            })
            return
        })
    })
})

router.get('/', Evaluate.eval_get_projects, async (req, res) => {
    
    const user_id = req.query.userId;

    UserModel.findOne({ id: user_id }).then((userExists) => {
        if (!userExists) {
            res.status(501).send({
                message: 'User not exist'
            })
            return
        }

        ProjectModel.find({ owner: { $in: [userExists._id] } }).sort({"createdAt": -1})
        .populate("tasks")
        .then((userProjects) => {
            res.send({
                projects: userProjects
            })
        }).catch(err => {
            res.status(501).send({
                message: err.Error
            })
            return
        })
        
    }).catch(err => {
        console.log('Error: ' + err)
        res.status(501).send({
            message: err.Error
        })
        return
    })
    
})

router.get('/all', async (req, res) => {

    ProjectModel.find({}).sort({"createdAt": -1})
    .populate("tasks")
    .then((userProjects) => {

        let projects = []

        userProjects.forEach((project) => {
            
            let projectData = {
                name: project.name
            }

            let durationHours = 0 
            let durationMinutes = 0
            let durationSeconds = 0

            project.tasks.forEach((task) => {
                durationHours += task.durationHours
                durationMinutes += task.durationMinutes
                durationSeconds += task.durationSeconds

                if(durationMinutes >= 60){
                    durationHours += 1
                    durationMinutes -= 60
                }

                if(durationSeconds >= 60){
                    durationMinutes += 1
                    durationSeconds -= 60
                }
            })

            projectData.durationHours = durationHours
            projectData.durationMinutes = durationMinutes
            projectData.durationSeconds = durationSeconds
            
            projects.push(projectData)
        })

        res.send({
            projects
        })
    }).catch(err => {
        res.status(501).send({
            message: err.Error
        })
        return
    })
    
})

router.get('/users', async (req, res) => {

    UserModel.find({}).sort({"createdAt": -1})
    .populate("tasks")
    .then((userExists) => {

        let usersTimes = []

        userExists.forEach((user) => {
            
            let usersData = {
                name: user.name
            }

            let durationHours = 0 
            let durationMinutes = 0
            let durationSeconds = 0

            user.tasks.forEach((task) => {
                durationHours += task.durationHours
                durationMinutes += task.durationMinutes
                durationSeconds += task.durationSeconds

                if(durationMinutes >= 60){
                    durationHours += 1
                    durationMinutes -= 60
                }

                if(durationSeconds >= 60){
                    durationMinutes += 1
                    durationSeconds -= 60
                }
            })

            usersData.durationHours = durationHours
            usersData.durationMinutes = durationMinutes
            usersData.durationSeconds = durationSeconds
            
            usersTimes.push(usersData)
        })

        res.send({
            usersTimes
        })
    }).catch(err => {
        res.status(501).send({
            message: err.Error
        })
        return
    })
    
})

module.exports = router