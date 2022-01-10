const express = require("express");
const router = express.Router();

const {error, success} = require("../middleware/sender/sender");
const syntax = require("../middleware/syntax");
const jwt_middleware = require("../middleware/jwt");


// controllers
const grades_controller = require("../controllers/grades");


router.get("/me", jwt_middleware.check_token, (req, res) => {
    const user_id = parseInt(req.payload.id);
    if (!syntax.id(user_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The user_id do not respect the user_id syntax',
            key: "user_id"
        })
    }
    grades_controller.get_user_grades_details(user_id, (err, grades_data) => {
        if (err){
            return error.send_err(res, err);
        }
        success.send(res, grades_data);
    })
})

router.post("/set", jwt_middleware.check_token, (req, res) => {
    const user_id = parseInt(req.payload.id);
    if (!syntax.id(user_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The user_id do not respect the user_id syntax',
            key: "user_id"
        })
    }

    if (typeof req.body.control_id == "undefined") {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The control_id is missing in the body',
            key: "control_id"
        })
    }

    if (typeof req.body.value == "undefined") {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The value is missing in the body',
            key: "value"
        })
    }

    const control_id = parseInt(req.body.control_id);
    if (!syntax.id(control_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The control_id do not respect the id syntax',
            key: "control_id"
        })
    }

    const value = parseFloat(req.body.value);
    if (!syntax.positive_number(value)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The value do not respect the positive_number syntax',
            key: "value"
        })
    }

    grades_controller.set_grade(user_id, control_id, value, (err) => {
        if (err){
            return error.send_err(res, err);
        }
        success.send(res, {message: "success"});
    })
})

router.delete("/delete", jwt_middleware.check_token, (req, res) => {
    const user_id = parseInt(req.payload.id);
    if (!syntax.id(user_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The user_id do not respect the user_id syntax',
            key: "user_id"
        })
    }

    if (typeof req.query.control_id == "undefined") {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The control_id is missing in the query',
            key: "control_id"
        })
    }


    const control_id = parseInt(req.query.control_id);
    if (!syntax.id(control_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The control_id do not respect the id syntax',
            key: "control_id"
        })
    }

    grades_controller.remove_grade(user_id, control_id, () => {});
    success.send(res, {message: "The request to delete have been received, but no garanty of the result"});
})

router.delete("/delete_by_subject", jwt_middleware.check_token, (req, res) => {
    const user_id = parseInt(req.payload.id);
    if (!syntax.id(user_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The user_id do not respect the user_id syntax',
            key: "user_id"
        })
    }

    if (typeof req.query.subject_id == "undefined") {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The subject_id is missing in the query',
            key: "subject_id"
        })
    }


    const subject_id = parseInt(req.query.subject_id);
    if (!syntax.id(subject_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The subject_id do not respect the id syntax',
            key: "subject_id"
        })
    }

    grades_controller.remove_grades_by_subject(user_id, subject_id);
    success.send(res, {message: "The request to delete have been received, but no garanty of the result"});
})


module.exports = router;
