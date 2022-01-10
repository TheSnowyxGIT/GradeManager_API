
const pool = require('./ddb');

const { error } = require("../sender/sender")
const syntax = require("../syntax")


module.exports.get_subjects = function (callback) {
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`subjects\``,
            (err, res) => {

                conn.release();

                if (!err) {
                    return callback(undefined, res);
                } else {
                    return callback(error.get(error.types.MysqlError, { error: err }));
                }
            });
    });
}

module.exports.get_subjects_by_module = function (module_id, callback) {
    if (!syntax.id(module_id)) {
        error.throw("get_subjects_by_module: module incorrect");
    }
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`subjects\` WHERE \`module_id\` = ?`,
            [module_id],
            (err, res) => {

                conn.release();

                if (!err) {
                    return callback(undefined, res);
                } else {
                    return callback(error.get(error.types.MysqlError, { error: err }));
                }
            });
    });

}

module.exports.get_subject_by_id = function (subject_id, callback) {
    if (!syntax.id(subject_id)) {
        error.throw("get_subject_by_id: subject_id incorrect");
    }
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`subjects\` WHERE \`id\` = ?`,
            [subject_id],
            (err, res) => {

                conn.release();

                if (!err) {
                    if (res.length == 0) {
                        return callback(undefined, undefined);
                    } else {
                        return callback(undefined, res[0]);
                    }
                } else {
                    return callback(error.get(error.types.MysqlError, { error: err }));
                }
            });
    });


}


module.exports.subject_exists = function (name, module_id, callback) {
    if (!syntax.subject(name)) {
        error.throw("subject_exists: name incorrect");
    }
    if (module_id && !syntax.id(module_id)) {
        error.throw("subject_exists: module incorrect");
    }
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        if (!module_id) {
            conn.execute(
                `SELECT * FROM \`subjects\` WHERE \`name\` = ? and \`module_id\` IS NULL`,
                [name],
                (err, res) => {

                    conn.release();

                    if (!err) {
                        return callback(undefined, res.length > 0);
                    } else {
                        return callback(error.get(error.types.MysqlError, { error: err }));
                    }
                });
        }
        else {
            conn.execute(
                `SELECT * FROM \`subjects\` WHERE \`name\` = ? and \`module_id\` = ?`,
                [name, module_id],
                (err, res) => {

                    conn.release();

                    if (!err) {
                        return callback(undefined, res.length > 0);
                    } else {
                        return callback(error.get(error.types.MysqlError, { error: err }));
                    }
                });
        }
    });
}

module.exports.subject_exists_by_id = function (subject_id, callback) {
    if (!syntax.id(subject_id)) {
        error.throw("subject_exists_by_id: subject_id incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`subjects\` WHERE \`id\` = ?`,
            [subject_id],
            (err, res) => {

                conn.release();

                if (!err) {
                    return callback(undefined, res.length > 0);
                } else {
                    return callback(error.get(error.types.MysqlError, { error: err }));
                }
            });
    });

}


module.exports.add_subject = function (name, module_id, displayName, coef, callback) {
    if (!syntax.subject(name)) {
        error.throw("add_subject: name incorrect");
    }
    if (coef && !syntax.positive_number(coef)) {
        error.throw("add_subject: coef incorrect");
    }
    if (module_id && !syntax.id(module_id)) {
        error.throw("add_subject: module incorrect");
    }
    if (displayName && !syntax.notempty_string(displayName)) {
        error.throw("add_subject: displayName incorrect");
    }
    if (!displayName) {
        displayName = subject;
    }


    module.exports.subject_exists(name, module_id, (err, subject_exists) => {
        if (err) {
            return callback(err);
        }
        if (subject_exists) {
            return callback(error.get(error.types.SubjectAlreadyExists, {
                message: "Can't add this subject because it already exists.",
                subject_name: name,
            }))
        }
        pool.getConnection((err, conn) => {
            if (err) {
                return callback(error.get(error.types.MysqlError, { error: err }));
            }
            if (!module_id) {
                conn.execute(
                    `INSERT INTO \`subjects\` (\`name\`, \`display_name\`, \`coef\`) VALUES (?,?,?)`,
                    [name, displayName, coef],
                    err => {

                        conn.release();

                        if (!err) {
                            return callback(undefined);
                        } else {
                            return callback(error.get(error.types.MysqlError, { error: err }));
                        }
                    });
            } else {
                conn.execute(
                    `INSERT INTO \`subjects\` (\`name\`, \`module_id\`, \`display_name\`, \`coef\`) VALUES (?,?,?,?)`,
                    [name, module_id, displayName, coef],
                    err => {

                        conn.release();

                        if (!err) {
                            return callback(undefined);
                        } else {
                            return callback(error.get(error.types.MysqlError, { error: err }));
                        }
                    });
            }
        });
    });
}
