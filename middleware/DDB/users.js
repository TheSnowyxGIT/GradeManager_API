const pool = require('./ddb');

const { error } = require("../sender/sender");
const syntax = require("../syntax");


/**
 * Recupère les données de l'utilisateur
 * 
 * @param {number} id l'id de l'utilisateur epinotes
 * @param {function} callback La fonction qui sera appellée avec le resulat mysql
 */
module.exports.get_user = function (id, callback) {
    if (!syntax.id(id)) {
        error.throw("get_user: user_id incorrect");
    }
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            'SELECT * FROM `users` WHERE id = ?',
            [id],
            (err, users) => {

                conn.release();

                if (!err) {
                    if (users.length != 1) {
                        return callback(error.get(error.types.UnknownUser, {
                            message: 'The user do not exists.',
                            user_id: id
                        }));
                    }
                    const user = users[0];
                    const data = {
                        id: user.id,
                        email: user.email,
                        login: user.login,
                        name: user.name,
                        status: user.status,
                        semester: user.semester,
                        campus: user.campus,
                    }
                    return callback(undefined, data)

                } else {
                    return callback(error.get(error.types.MysqlError, { error: err }));
                }
            }
        );
    })
}


/**
 * Recupère l'id de l'utilisateur epinotes à partir de l'email
 * 
 * @param {string} email l'email de l'utilisateur epinotes
 * @param {function} callback La fonction qui sera appellée avec le resulat mysql
 */
module.exports.get_id_from_email = function (email, callback) {
    if (!syntax.mail(email)) {
        error.throw("get_id_from_email: mail incorrect");
    }
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            'SELECT `id` FROM `users` WHERE email = ?',
            [email],
            (err, results) => {

                conn.release();

                if (!err) {
                    if (results.length != 1) {
                        return callback(error.get(error.types.UnknownUser, {
                            message: 'The user do not exists.',
                            email: email
                        }));
                    }
                    return callback(undefined, results[0].id);
                } else {
                    return callback(error.get(error.types.MysqlError, { error: err }));
                }
            }
        );
    });
}


/**
 * Créer un nouveau utilisateur epinotes
 * 
 * @param data Information about the user.
 * @param data.name The name of the user.
 * @param data.email The email of the user.
 * @param data.login The login of the user.
 * @param data.status The status of the user.
 * @param data.semester The semester of the user.
 * @param data.campus The campus of the user.
 * 
 * @param {function} callback La fonction qui sera appellée avec le resulat mysql
*/
module.exports.createEpinotesAccount = function (data, callback) {
    if (!data) {
        error.throw("createEpinotesAccount: missing data");
    }

    const name = data.name;
    const email = data.email;
    const login = data.login;
    const status = data.status;
    const semester = data.semester;
    const campus = data.campus;

    if (!name || !email || !login || !status || !semester || !campus) {
        error.throw("createEpinotesAccount: missing values in data");
    }
    if (!syntax.name(name)) {
        error.throw("createEpinotesAccount: name incorrect");
    }
    if (!syntax.mail(email)) {
        error.throw("createEpinotesAccount: mail incorrect");
    }
    if (!syntax.login(login)) {
        error.throw("createEpinotesAccount: login incorrect");
    }
    if (!syntax.status(status)) {
        error.throw("createEpinotesAccount: status incorrect");
    }
    if (!syntax.semester(semester)) {
        error.throw("createEpinotesAccount: semester incorrect");
    }
    if (!syntax.campus(campus)) {
        error.throw("createEpinotesAccount: campus incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            'INSERT INTO `users`(`email`, `login`, `status`, `name`, `semester`, `campus`) VALUES (?,?,?,?,?,?)',
            [email, login, status, name, semester, campus],
            err => {

                conn.release();

                if (!err) {
                    callback(undefined);
                } else {
                    return callback(error.get(error.types.MysqlError, { error: err }));
                }
            }
        );
    });

}

/**
 * Créer un nouveau utilisateur epinotes
 * 
 * @param {number} user_id l'id de l'utilisateur epinotes
 * @param {Object} data Information about the user.
 * @param data.status The status of the user.
 * @param data.campus The campus of the user.
 * @param data.semester The semester of the user.
 * 
 * @param {function} callback La fonction qui sera appellée avec le resulat mysql
*/
module.exports.updateEpinotesAccount = function (id, data, callback) {
    if (!data) {
        error.throw("updateEpinotesAccount: missing data");
    }
    const status = data.status;
    const semester = data.semester;
    const campus = data.campus;

    if (!id || !status || !campus || !semester) {
        error.throw("updateEpinotesAccount: missing values in data");
    }
    if (!syntax.status(status)) {
        error.throw("updateEpinotesAccount: status incorrect");
    }
    if (!syntax.semester(semester)) {
        error.throw("updateEpinotesAccount: semester incorrect");
    }
    if (!syntax.campus(campus)) {
        error.throw("updateEpinotesAccount: campus incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            'UPDATE `users` SET `status`=?, `semester`=?, `campus`=?  WHERE id = ?',
            [status, semester, campus, id],
            err => {

                conn.release();

                if (!err) {
                    callback(undefined);
                } else {
                    return callback(error.get(error.types.MysqlError, { error: err }));
                }
            }
        );
    });

}
