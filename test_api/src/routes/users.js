const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
// Model
const UserModel = require('../models/user')
// Utilities
const Evaluate = require('../utilities/evaluate')
const DateUtils = require('../utilities/dates')

/**
 * TODO: API Users
 */

router.post('/add', Evaluate.eval_new_user, async (req, res) => {
    const { user_id, user_name } = req.body;
    const timestamp = DateUtils.getLocalDate(new Date())

    let user_data = {
        id: user_id,
        name: user_name,
        createdAt: timestamp,
        updatedAt: timestamp
    }

    const newUser = new UserModel(user_data)

    UserModel.findOne({ id: user_id }).then((userExists) => {
        if (userExists) {
            res.status(501).send({
                message: 'User already exists.'
            })
            return
        }

        newUser.save().then(() => {
            res.send({
                message: 'The user has been registered'
            })
        }).catch(err => {
            res.status(501).send({
                message: err.Error
            })
            return
        })
    })
})

module.exports = router