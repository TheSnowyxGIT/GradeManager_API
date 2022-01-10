const express = require("express");
const router = express.Router();

const {error, success} = require("../middleware/sender/sender");
const syntax = require("../middleware/syntax");
const jwt_middleware = require("../middleware/jwt");


const ddb_subject = require("../middleware/DDB/subjects");
const ddb_controls_types = require("../middleware/DDB/controls_types")

// controller
const controls_types_controller = require("../controllers/controls_types");

/*
router.get("/", jwt_middleware.check_token, (req, res) => {
    let subject_id = undefined;
    if (req.query.subject_id) {
        subject_id = parseInt(req.query.subject_id);
        if (!syntax.id(subject_id)) {
            return error.send(res, error.types.RequestInvalid, {
                message: 'The subject_id do not respect the id syntax',
                key: "subject_id"
            })
        }
    }
    controls_types_controller.get_controls_types_with_filters(subject_id, (err, controls_types) => {
        if (err){
            return error.send_err(res, err);
        }
        return success.send(res, controls_types);
    })
})

router.post("/", jwt_middleware.check_token, (req, res) => {
    if (!req.body) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The body is missing',
        })
    }

    if (!req.body.subject_id) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The subject_id is missing in the body',
            key: "subject_id"
        })
    }
    if (!req.body.name) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The name is missing in the body',
            key: "name"
        })
    }
    if (!req.body.display_name) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The display_name is missing in the body',
            key: "display_name"
        })
    }
    if (!req.body.coef) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The coef is missing in the body',
            key: "coef"
        })
    }
    const subject_id = parseInt(req.body.subject_id);
    const name = req.body.name;
    const display_name = req.body.display_name;
    const coef = req.body.coef;

    if (!syntax.id(subject_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The subject_id do not respect the id syntax',
            key: "subject_id"
        })
    }
    if (!syntax.notempty_string(name)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The name do not respect the string syntax',
            key: "name"
        })
    }
    if (!syntax.notempty_string(display_name)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The display_name do not respect the string syntax',
            key: "display_name"
        })
    }
    if (!syntax.positive_number(coef)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The coef do not respect the coef syntax',
            key: "coef"
        })
    }

    controls_types_controller.add_control_type(subject_id, name, display_name, coef, (err) => {
        if (err) {
            return error.send_err(res, err);
        }
        return success.send(res, {
            message: "Control type type successfully added.",
            subject_id: subject_id,
            coef: coef,
            display_name: display_name,
            name: name,
        });
    })
})

router.delete("/", jwt_middleware.check_token, (req, res) => {
    if (!req.query) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The query is missing',
        })
    }

    if (!req.query.subject_id) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The subject_id is missing in the query',
            key: "subject_id"
        })
    }
    if (!req.query.name) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The name is missing in the query',
            key: "name"
        })
    }
    const subject_id = parseInt(req.query.subject_id);
    const name = req.query.name;

    if (!syntax.id(subject_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The subject_id do not respect the id syntax',
            key: "subject_id"
        })
    }
    if (!syntax.notempty_string(name)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The name do not respect the string syntax',
            key: "name"
        })
    }

    controls_types_controller.remove_control_type(subject_id, name, err => {
        if (err) {
            return error.send_err(res, err);
        }
        return success.send(res, {
            message: "Subject successfully deleted.",
            subject_id: subject_id,
            name: name
        });
    })
})
*/

module.exports = router;
