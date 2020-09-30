function eval_new_user(req, res, next) {
    const { user_id, user_name } = req.body;
    if(!user_id || !user_name){
        return res.status(401).send({ code: -1, message: 'Incomplete data' })
    }
    next()
}

function eval_new_task(req, res, next) {
    const { user_id, task_name, task_hours, task_min, task_sec, task_mode} = req.body;
    if(!user_id || task_hours === undefined || task_min === undefined || task_sec === undefined || !task_mode){
        return res.status(401).send({ code: -1, message: 'Incomplete data' })
    }

    // For manual tasks
    if(task_mode === 'M' && !task_name){
        return res.status(401).send({ code: -1, message: 'Incomplete data' })
    }

    if(task_mode === 'U'){
        req.body.task_name = 'Unknown'
    }

    next()
}

function eval_get_task(req, res, next) {
    const user_id = req.query.userId;
    if(!user_id){
        return res.status(401).send({ code: -1, message: 'Incomplete data' })
    }
    next()
}

function eval_new_project(req, res, next) {
    const { user_id, project_name } = req.body;
    if(!user_id || !project_name){
        return res.status(401).send({ code: -1, message: 'Incomplete data' })
    }
    next()
}

function eval_get_projects(req, res, next) {
    const user_id = req.query.userId;
    if(!user_id){
        return res.status(401).send({ code: -1, message: 'Incomplete data' })
    }
    next()
}

function eval_continue_task(req, res, next) {
    const { user_id, task_id, task_hours, task_min, task_sec } = req.body;
    if(!user_id || !task_id || task_hours === undefined || task_min === undefined || task_sec === undefined){
        return res.status(401).send({ code: -1, message: 'Incomplete data' })
    }
    next()
}

module.exports = {
    eval_new_user, eval_new_task, eval_get_task, eval_new_project, eval_get_projects, eval_continue_task
}