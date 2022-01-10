const express = require("express");
const router = express.Router();

const syntax = require("../middleware/syntax"); // verificateur de variables
const { error, success } = require("../middleware/sender/sender");
const jwt_middleware = require("../middleware/jwt");
const ddb_users = require("../middleware/DDB/users");

/**
 * Renvoie les info de l'utilisateur
 */
router.get("/me", jwt_middleware.check_token, (req, res) => {
    const user_id = parseInt(req.payload.id);
    if (!syntax.id(user_id)) {
        return error.send(res, error.types.RequestInvalid, {
            message: 'The user_id do not respect the user_id syntax',
            key: "user_id"
        })
    }
    let filter = "minimal";
    if (req.query.filter){
        const value = req.query.filter;
        if (!syntax.notempty_string(value) || (value != "minimal" && value != "details"))
        {
            return error.send(res, error.types.RequestInvalid, {
                message: 'The filter do not respect the filter syntax',
                key: "filter"
            })
        }
    }
    if (filter == "minigmal") //default
    {
        ddb_users.get_user(user_id, (err, user_data) => {
            if (err) {
                return error.send_err(res, err);
            }
            success.send(res, user_data);
        });
    }
    else // details
    {
        ddb_users.get_user(user_id, (err, user_data) => {
            if (err) {
                return error.send_err(res, err);
            }
            const login = user_data.login;
            success.send(res, user_data);
        });
    }
})

module.exports = router;
