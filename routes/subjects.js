
const express = require("express");
const router = express.Router();

const {error, success} = require("../middleware/sender/sender");
const syntax = require("../middleware/syntax");
const jwt_middleware = require("../middleware/jwt");


// controller
const subjects_controller = require("../controllers/subjects");


/*
router.get("/", jwt_middleware.check_token, (req, res) => {
    let module_id = undefined;
    if (req.query.module_id) {
        module_name = parseInt(req.query.module_id);
        if (!syntax.id(module_id)) {
            return error.send(res, error.types.RequestInvalid, {
                message: 'The module do not respect the id syntax',
                key: "module"
            })
        }
    }
    subjects_controller.get_subjects_with_filters(module_id, (err, subjects) => {
        if (err){
            return error.send_err(res, err);
        }
        return success.send(res, subjects);
    })
})


router.post("/", jwt_middleware.check_token, (req, res) => {
    if (!req.body) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The body is missing',
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

    const name = req.body.name;
    const display_name = req.body.display_name;
    const coef = req.body.coef;
    let module_id = undefined;
    if (req.body.module_id) {
        module_id = parseInt(req.body.module_id);
    }

    if (!syntax.subject(name)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The name do not respect the subject syntax',
            key: "name"
        })
    }
    if (!syntax.notempty_string(display_name)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The display_name do not respect the semester syntax',
            key: "display_name"
        })
    }
    if (!syntax.positive_number(coef)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The coef do not respect the coef syntax',
            key: "coef"
        })
    }
    if (module_name && !syntax.id(module_name)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The module_id do not respect the id syntax',
            key: "module_id"
        })
    }

    subjects_controller.add_subject(name, module_id, display_name, coef, (err) => {
        if (err) {
            return error.send_err(res, err);
        }
        return success.send(res, {
            message: "Subject successfully added.",
            name: name,
            coef: coef,
            display_name: display_name,
            module_id: module_id || "NULL"
        });
    })
})


router.delete("/", jwt_middleware.check_token, (req, res) => {
    if (!req.query) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The query is missing',
        })
    }

    if (!req.query.name) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The name is missing in the query',
            key: "name"
        })
    }

    const name = req.query.name;
    let module_id = undefined;
    if (req.query.module_id) {
        module_id = pareInt(req.query.module_id);
    }

    if (!syntax.subject(name)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The name do not respect the subject syntax',
            key: "name"
        })
    }
    if (module_id && !syntax.id(module_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The module_id do not respect the id syntax',
            key: "module_id"
        })
    }


    subjects_controller.remove_subject(name, module_id, err => {
        if (err) {
            return error.send_err(res, err);
        }
        return success.send(res, {
            message: "Subject successfully deleted.",
            subject_name: name,
            module_id: module_id || "NULL"
        });
    })
})
*/

module.exports = router;
