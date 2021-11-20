const express = require("express");
const router = express.Router();

// Load the configuration
const config = require("../config.json");

const syntax = require("../middleware/syntax"); // verificateur de variables
const microsoft_api = require("../middleware/other_api/microsoft");
const cri_api = require("../middleware/other_api/cri_epita");
const { error, success } = require("../middleware/sender/sender");
const { send } = require("../middleware/sender/success");

/**
 * Renvoie un token d'acces pour l'api
 * Uniquement avec "access_token microsoft" pour l'instant
 */
router.get("/token", (req, res) => {
    const microsoft_token = req.query.microsoft_token;
    if (syntax.notempty_string(microsoft_token) == false) {
        return error.send(res, error.types.RequestInvalid, {
            message: "Request params missing.",
            params: ["microsoft_token"]
        });
    }
    microsoft_api.get_userinfo(microsoft_token, (err, user_data) => {
        if (err) {
            return error.send(res, error.types.InternRequestFailed, {
                message: 'Request to microsoft failed',
                error: err
            })
        }
        const mail = user_data.mail;
        const name = user_data.displayName;
        if (!mail.includes("@epita.fr")) {
            return error.send(res, error.types.Unauthorized, {
                message: 'this user is not allow to access because his email do not end by epita.fr',
            })
        }

        cri_api.get_userinfo(mail, (err, user_data) => {
            if (err) {
                return error.send_err(res, err);
            }
            const login = user_data.login;
            const status = user_data.status;
            const semester = user_data.semester;
            const campus = user_data.campus;

            success.send(res, {
                message: "success to get the token but without token car pas implementé encore mdr",
                data: {
                    name: name,
                    mail: email,
                    login: login,
                    status: status,
                    semester: semester,
                    campus: campus
                }
            })
        })
    })
})

module.exports = router;