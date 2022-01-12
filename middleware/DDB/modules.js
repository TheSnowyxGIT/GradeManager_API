const pool = require('./ddb');

const { error } = require("../sender/sender")
const syntax = require("../syntax")


module.exports.get_modules = function (callback) {
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`modules\` ORDER BY name`,
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

module.exports.get_modules_by_semester = function (semester, callback) {
    if (!syntax.semester(semester)) {
        error.throw("get_modules_by_semester: semester incorrect");
    }
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            `SELECT * FROM \`modules\` WHERE \`semester\` = ? ORDER BY name`,
            [semester],
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


