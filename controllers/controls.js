/**
 *
 * Gestion of controls
 *
 */

const ddb_controls = require("../middleware/DDB/controls");

module.exports.get_controls_with_filters = (control_type_id, callback) => {
    // we suppose params correct.
    if (typeof control_type_id == "undefined") {
        ddb_controls.get_controls((err, controls) => {
            if (err) {
                return callback(err);
            }
            return callback(undefined, controls)
        })
    } else {
        ddb_controls.get_controls_by_control_type(control_type_id, (err, controls) => {
            if (err) {
                return callback(err);
            }
            return callback(undefined, controls)
        })
    }
}


module.exports.control_exists = (control_id, callback) => {
    ddb_controls.control_exists_by_id(control_id, (err, exists) => {
        if (err) {
            return callback(err)
        }
        return callback(undefined, exists);
    })

}

module.exports.add_control = (control_type_id, name, display_name, coef, callback) => {
    ddb_controls.add_control(control_type_id, name, display_name, coef, err => {
        if (err) {
            return callback(err)
        }
        return callback(undefined);
    })

}

module.exports.remove_control = (control_type_id, name, callback) => {
    ddb_controls.delete_control(control_type_id, name, err => {
        if (err) {
            return callback(err)
        }
        return callback(undefined);
    })

}
