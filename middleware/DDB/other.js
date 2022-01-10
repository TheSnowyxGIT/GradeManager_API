const pool = require('./ddb');


module.exports.ping = function () {
    pool.getConnection((err, conn) => {
        if (err) {
            return callback(error.get(error.types.MysqlError, { error: err }));
        }
        conn.execute(
            `SELECT 1`,
            () => { 
                conn.release();
            });
    });
}
