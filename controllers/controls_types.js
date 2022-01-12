/**
 *
 * Gestion of controls_types
 *
 */

const { error } = require("../middleware/sender/sender")

const ddb_controls_types = require("../middleware/DDB/controls_types");
const ddb_subjects = require("../middleware/DDB/subjects");

module.exports.get_controls_types_with_filters = (subject_id, callback) => {
    // we suppose params correct.
    if (!subject_id) {
        ddb_controls_types.get_controls_types((err, controls_types) => {
                if (err) {
                return callback(err);
                }
                return callback(undefined, controls_types)
                })
    } else {
        ddb_controls_types.get_controls_types_by_subject(subject_id, (err, controls_types) => {
                if (err) {
                return callback(err);
                }
                return callback(undefined, controls_types)
                })
    }
} 

/*
module.exports.add_control_type = (subject_id, name, display_name, coef, callback) => {
    ddb_subjects.subject_exists_by_id(subject_id, (err, subject_exists) => {
        if (err) {
            return callback(err)
        }
        if (!subject_exists){
            return callback(error.get(error.types.SubjectNotExists, {
                 message: "The subject do not exists",
                 subject_id: subject_id 
            }));
        }
        ddb_controls_types.add_controls_type(subject_id, name, display_name, coef, err => {
            if (err) {
                return callback(err)
            }
            return callback(undefined);
        })
    });
}

module.exports.remove_control_type = (subject_id, name, callback) => {
    ddb_controls_types.delete_controls_type(subject_id, name, err => {
        if (err) {
            return callback(err)
        }
        return callback(undefined);
    })

}
*/
