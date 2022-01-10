const pool = require('./ddb');

const { error } = require("../sender/sender")
const syntax = require("../syntax")

module.exports.get_user_grades = function (user_id, callback) {
    if (!syntax.id(user_id)) {
        error.throw("get_user_grade: user_id incorrect");
    }
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`grades\` WHERE \`user_id\` = ?`,
            [user_id],
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

module.exports.grade_exists = function (user_id, control_id, callback) {
    if (!syntax.id(user_id)) {
        error.throw("grade_exists: user_id incorrect");
    }
    if (!syntax.id(control_id)) {
        error.throw("grade_exists: control_id incorrect");
    }

    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.mysqlerror, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`grades\` WHERE \`user_id\` = ? and \`control_id\` = ?`,
            [user_id, control_id],
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

module.exports.add_grade = function (user_id, control_id, value, callback) {
    if (!syntax.id(user_id)) {
        error.throw("add_grade: user_id incorrect");
    }
    if (!syntax.id(control_id)) {
        error.throw("add_grade: control_id incorrect");
    }
    if (!syntax.positive_number(value)) {
        error.throw("add_grade: value incorrect");
    }

    module.exports.grade_exists(user_id, control_id, (err, grade_exists) => {
        if (err) {
            return callback(err);
        }
        if (grade_exists) {
            return callback(error.get(error.types.GradeAlreadyExists, {
                message: "Can't add this grade because it already exists.",
            }))
        }

        pool.getConnection((err, conn) => {
            if (err) {
                return callback(error.get(error.types.mysqlerror, { error: err }));
            }
            conn.execute(
                `INSERT INTO \`grades\` (\`user_id\`, \`control_id\`, \`value\`) VALUES (?,?,?)`,
                [user_id, control_id, value],
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

module.exports.update_grade = function (user_id, control_id, value, callback) {
    if (!syntax.id(user_id)) {
        error.throw("add_grade: user_id incorrect");
    }
    if (!syntax.id(control_id)) {
        error.throw("add_grade: control_id incorrect");
    }
    if (!syntax.positive_number(value)) {
        error.throw("add_grade: value incorrect");
    }

    module.exports.grade_exists(user_id, control_id, (err, grade_exists) => {
        if (err) {
            return callback(err);
        }
        if (!grade_exists) {
            return callback(error.get(error.types.GradeNotExists, {
                message: "Can't update this grade because it do not exists.",
            }))
        }

        pool.getConnection((err, conn) => {
            if (err) {
                return callback(error.get(error.types.mysqlerror, { error: err }));
            }

            conn.execute(
                `UPDATE \`grades\` SET \`value\`=? WHERE \`user_id\` = ? and \`control_id\` = ?`,
                [value, user_id, control_id],
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

module.exports.delete_grade = function (user_id, control_id, callback) {
    if (!syntax.id(user_id)) {
        error.throw("add_grade: user_id incorrect");
    }
    if (!syntax.id(control_id)) {
        error.throw("add_grade: control_id incorrect");
    }

    module.exports.grade_exists(user_id, control_id, (err, grade_exists) => {
        if (err) {
            return callback(err);
        }
        if (!grade_exists) {
            return callback(error.get(error.types.GradeNotExists, {
                message: "Can't delete this grade 'cause it do not exists.",
            }));
        }

        pool.getConnection((err, conn) => {
            if (err) {
                return callback(error.get(error.types.mysqlerror, { error: err }));
            }

            conn.execute(
                `DELETE FROM \`grades\` WHERE \`user_id\` = ? and \`control_id\` = ?`,
                [user_id, control_id],
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
