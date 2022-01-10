/**
 *
 * Gestion of subjects
 *
 */

const ddb_modules = require("../middleware/DDB/modules");


module.exports.get_modules_with_filters = (semester, callback) => {
    // we suppose params correct.
    if (typeof semester != "undefined") {
        ddb_modules.get_modules_by_semester(semester, (err, subjects) => {
            if (err) {
                return callback(err);
            }
            return callback(undefined, subjects)
        })
    } else {
        ddb_modules.get_modules((err, subjects) => {
            if (err) {
                return callback(err);
            }
            return callback(undefined, subjects)
        })
    }
} 
