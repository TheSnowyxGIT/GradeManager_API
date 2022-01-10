/**
 *
 * Gestion of subjects
 *
 */

const ddb_subject = require("../middleware/DDB/subjects");
const ddb_users = require("../middleware/DDB/users");


module.exports.get_subjects_with_filters = (module_id, callback) => {
    // we suppose params correct.
    if (!module_id) {
        ddb_subject.get_subjects((err, subjects) => {
                if (err) {
                return callback(err);
                }
                return callback(undefined, subjects)
                })
    } else {
        ddb_subject.get_subjects_by_module(module_id, (err, subjects) => {
                if (err) {
                return callback(err);
                }
                return callback(undefined, subjects)
                })
    }
} 

module.exports.add_subject = (name, module_id, display_name, coef, callback) => {
    ddb_subject.add_subject(name, module_id, display_name, coef, err => {
        if (err) {
            return callback(err)
        }
        return callback(undefined);
    })

}

module.exports.remove_subject = (name, module_id, callback) => {
    ddb_subject.delete_subject(name, module_id, err => {
        if (err) {
            return callback(err)
        }
        return callback(undefined);
    })

}
