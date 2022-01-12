const express = require("express");
const router = express.Router();

// Load the configuration
const config = require("../config.json");

const syntax = require("../middleware/syntax"); // verificateur de variables
const microsoft_api = require("../middleware/other_api/microsoft");
const cri_api = require("../middleware/other_api/cri_epita");
const { error, success } = require("../middleware/sender/sender");
const jwt_middleware = require("../middleware/jwt");
const ddb_users = require("../middleware/DDB/users");

/**
 * Create / Update the user to the database
 * Return the id of the user
 */
function save_user(mail, data, callback) {
    ddb_users.get_id_from_email(mail, (err, id) => {
        if (!err) {
            // Ancien sur epinotes
            ddb_users.updateEpinotesAccount(id, data, err => {
                if (!err) {
                    callback(undefined, id);
                } else {
                    callback(err);
                }
            })
        } else {
            if (err.error.type === error.types.UnknownUser.type) {
                // Nouveau sur epinotes
                ddb_users.createEpinotesAccount(data, err => {
                    if (!err) {
                        // utilisateur créé
                        // Get the epinotes ID
                        ddb_users.get_id_from_email(mail, (err, id) => {
                            if (!err) {
                                callback(undefined, id);
                            } else {
                                callback(err);
                            }
                        });
                    } else {
                        callback(err);
                    }
                })
            } else {
                callback(err);
            }
        }
    });
}


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

            // @param data Information about the user.
            // @param data.name The name of the user.
            // @param data.email The email of the user.
            // @param data.login The login of the user.
            // @param data.status The status of the user.
            // @param data.semester The semester of the user.
            // @param data.campus The campus of the user.

            const data = {
                name: name,
                email: mail,
                login: login,
                status: status,
                semester: semester,
                campus: campus,
            }

            save_user(mail, data, (err, id) => {
                if (err) {
                    return error.send_err(res, err);
                }
                
                ddb_users.set_groups(login, user_data.cri_groups);

                const access_token = jwt_middleware.generateAccessToken({ id: id });
                success.send(res, {
                    access_token: access_token
                })
            })
        })
    })
})

module.exports = router;
