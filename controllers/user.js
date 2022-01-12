/**
 *
 * Gestion of users
 *
 */

const ddb_users = require("../middleware/DDB/users");

module.exports.get_user_minimal_info = (user_id, callback) => {
    // we suppose params correct.
    ddb_users.get_user(user_id, (err, user_data) => {
        if (err) {
            return callback(err);
        }
        ddb_users.get_groups(user_id, (err, groups) => {
            if (err) {
                return callback(err);
            }
            user_data.groups = groups;
            return callback(undefined, user_data);
        })
    })
}
