const pool = require('./ddb');

const { error } = require("../sender/sender")
const syntax = require("../syntax")

module.exports.get_controls_types = function (callback) {
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`controls_types\``,
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

module.exports.get_controls_types_by_subject = function (subject_id, callback) {
    if (!syntax.id(subject_id)) {
        error.throw("get_controls_types_by_subject: subject_id incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`controls_types\` WHERE \`subject_id\` = ?`,
            [subject_id],
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

module.exports.controls_type_exists = function (subject_id, name, callback) {
    if (!syntax.id(subject_id)) {
        error.throw("controls_type_exists: subject_id incorrect");
    }
    if (!syntax.notempty_string(name)) {
        error.throw("controls_type_exists: name incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`controls_types\` WHERE \`subject_id\` = ? and \`name\` = ?`,
            [subject_id, name],
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

module.exports.add_controls_type = function (subject_id, name, display_name, coef, callback) {
    if (!syntax.id(subject_id)) {
        error.throw("add_controls_type: subject_id incorrect");
    }
    if (!syntax.notempty_string(name)) {
        error.throw("add_controls_type: name incorrect");
    }
    if (!syntax.notempty_string(display_name)) {
        error.throw("add_controls_type: display_name incorrect");
    }
    if (!syntax.positive_number(coef)) {
        error.throw("add_controls_type: coef incorrect");
    }

    module.exports.controls_type_exists(subject_id, name, (err, controls_type_exists) => {
        if (err) {
            return callback(err);
        }
        if (controls_type_exists) {
            return callback(error.get(error.types.ControlTypeAlreadyExists, {
                message: "Can't add this control type because it already exists.",
            }))
        }
        
        pool.getConnection((err, conn) => {
            if (err) {
                return callback(error.get(error.types.mysqlerror, { error: err }));
            }
            conn.execute(
                `INSERT INTO \`controls_types\` (\`subject_id\`, \`name\`, \`display_name\`, \`coef\`) VALUES (?,?,?,?)`,
                [subject_id, name, display_name, coef],
                err => {

                    conn.release();

                    if (!err) {
                        return callback(undefined);
                    } else {
                        return callback(error.get(error.types.MysqlError, { error: err }));
                    }
                });
            });
        });
}

module.exports.delete_controls_type = function (subject_id, name, callback) {
    if (!syntax.id(subject_id)) {
        error.throw("add_controls_type: subject_id incorrect");
    }
    if (!syntax.notempty_string(name)) {
        error.throw("add_controls_type: name incorrect");
    }

    module.exports.controls_type_exists(subject_id, name, (err, controls_type_exists) => {
        if (err) {
            return callback(err);
        }
        if (!controls_type_exists) {
            return callback(error.get(error.types.ControlTypeNotExists, {
                message: "Can't delete this control type 'cause it do not exists exists.",
            }));
        }
 
        pool.getConnection((err, conn) => {
            if (err) {
                return callback(error.get(error.types.mysqlerror, { error: err }));
            }
    
            conn.execute(
                `DELETE FROM \`controls_types\` WHERE \`subject_id\` = ? and \`name\` = ?`,
                [subject_id, name],
                err => {

                    conn.release();

                    if (!err) {
                        return callback(undefined);
                    } else {
                        return callback(error.get(error.types.MysqlError, { error: err }));
                    }
                });
            });
        });
}
