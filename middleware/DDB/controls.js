const pool = require('./ddb');

const { error } = require("../sender/sender")
const syntax = require("../syntax")


    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
    });
 

module.exports.get_controls = function (callback) {

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`controls\``,
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


module.exports.get_controls_by_control_type = function (control_type_id, callback) {
    if (!syntax.id(control_type_id)) {
        error.throw("get_controls_by_control_type: control_type_id incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`controls\` WHERE \`control_type_id\` = ?`,
            [control_type_id],
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

module.exports.control_exists = function (control_type_id, name, callback) {
    if (!syntax.id(control_type_id)) {
        error.throw("controls_exists: control_type_id incorrect");
    }
    if (!syntax.notempty_string(name)) {
        error.throw("controls_exists: name incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`controls\` WHERE \`control_type_id\` = ? and \`name\` = ?`,
            [control_type_id, name],
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

module.exports.control_exists_by_id = function (control_id, callback) {
    if (!syntax.id(control_id)) {
        error.throw("control_exists_by_id: control_id incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`controls\` WHERE \`id\` = ?`,
            [control_id],
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

module.exports.add_control = function (control_type_id, name, display_name, coef, callback) {
    if (!syntax.id(control_type_id)) {
        error.throw("add_control: control_type_id incorrect");
    }
    if (!syntax.notempty_string(name)) {
        error.throw("add_control: name incorrect");
    }
    if (!syntax.notempty_string(display_name)) {
        error.throw("add_control: display_name incorrect");
    }
    if (!syntax.positive_number(coef)) {
        error.throw("add_control: coef incorrect");
    }

    module.exports.control_exists(control_type_id, name, (err, control_exists) => {
        if (err) {
            return callback(err);
        }
        if (control_exists) {
            return callback(error.get(error.types.ControlAlreadyExists, {
                message: "Can't add this control because it already exists.",
            }))
        }

        pool.getConnection((err, conn) => {
            if (err) {
                return callback(error.get(error.types.mysqlerror, { error: err }));
            }
             conn.execute(
                `INSERT INTO \`controls\` (\`control_type_id\`, \`name\`, \`display_name\`, \`coef\`) VALUES (?,?,?,?)`,
                [control_type_id, name, display_name, coef],
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

module.exports.delete_control = function (control_type_id, name, callback) {
    if (!syntax.id(control_type_id)) {
        error.throw("delete_control: control_type_id incorrect");
    }
    if (!syntax.notempty_string(name)) {
        error.throw("delete_control: name incorrect");
    }

    module.exports.control_exists(control_type_id, name, (err, control_exists) => {
        if (err) {
            return callback(err);
        }
        if (!control_exists) {
            return callback(error.get(error.types.ControlNotExists, {
                message: "Can't delete this control 'cause it do not exists exists.",
            }));
        }
        
        pool.getConnection((err, conn) => {
            if (err) {
                return callback(error.get(error.types.mysqlerror, { error: err }));
            }
             conn.execute(
                `DELETE FROM \`controls\` WHERE \`control_type_id\` = ? and \`name\` = ?`,
                [control_type_id, name],
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
