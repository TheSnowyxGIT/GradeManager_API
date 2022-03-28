/**
 *
 * Gestion of grades
 *
 */

const {
    error
} = require("../middleware/sender/sender");

const ddb_grades = require("../middleware/DDB/grades");

const users_controller = require("./user");
const modules_controller = require("./modules");
const subject_controller = require("./subjects");
const controls_types_controller = require("./controls_types");
const controls_controller = require("./controls");

/**
 * @brief Get and format the grades of the user
 * 
 * @param {*} user_id L'id de l'utilisateur epinotes
 * @param {*} callback 
 */
module.exports.get_user_grades_details = (user_id, callback) => {
    users_controller.get_user_minimal_info(user_id, (err, user_data) => {
        if (err) {
            return callback(err);
        }
        const semester = user_data.semester;
        if (!semester) {
            return error.get(error.types.UserNotHaveSemester, {
                message: "User do not have semester (maybe teacher)"
            });
        }
        const user_groups = user_data.groups;
        modules_controller.get_modules_with_filters(semester, (err, modules) => {
            if (err) {
                return callback(err);
            }
            subject_controller.get_subjects_with_filters(undefined, (err, subjects) => {
                if (err) {
                    return callback(err);
                }
                controls_types_controller.get_controls_types_with_filters(undefined, (err, controls_types) => {
                    if (err) {
                        return callback(err);
                    }
                    controls_controller.get_controls_with_filters(undefined, (err, controls) => {
                        if (err) {
                            return callback(err);
                        }
                        module.exports.get_user_grades(user_id, (err, grades) => {
                            if (err) {
                                return callback(err);
                            }

                            let grades_data = [];
                            modules.forEach(module => {

                                if (module.group_code && !user_groups.includes(module.group_code)){
                                    return;
                                }

                                const module_id = module.id;
                                let subjects_filted = subjects.filter(obj => obj.module_id == module_id);
                                let module_data = {
                                    id: module_id,
                                    code: module.code,
                                    name: module.name,
                                    coef: module.coef,
                                    data: []
                                }
                                subjects_filted.forEach(subject => {

                                    if (subject.group_code && !user_groups.includes(subject.group_code)){
                                        return;
                                    }

                                    const subject_id = subject.id;
                                    let controls_types_filted = controls_types.filter(obj => obj.subject_id == subject_id);
                                    let subject_data = {
                                        id: subject_id,
                                        name: subject.name,
                                        display_name: subject.display_name,
                                        coef: subject.coef,
                                        threshold: subject.threshold,
                                        data: []
                                    }
                                    controls_types_filted.forEach(ct => {
                                        const ct_id = ct.id;
                                        let controls_filted = controls.filter(obj => obj.control_type_id == ct_id);
                                        let ct_data = {
                                            id: ct_id,
                                            name: ct.name,
                                            display_name: ct.display_name,
                                            coef: ct.coef,
                                            data: []
                                        };
                                        controls_filted.forEach(control => {
                                            const control_id = control.id;
                                            let control_data = {
                                                id: control_id,
                                                name: control.name,
                                                display_name: control.display_name,
                                                coef: control.coef
                                            };
                                            const grade = grades.filter(obj => obj.control_id == control_id);
                                            if (grade.length != 0) {
                                                control_data.value = grade[0].value;
                                            }
                                            ct_data.data.push(control_data);
                                        })
                                        subject_data.data.push(ct_data);
                                    })
                                    module_data.data.push(subject_data);
                                });
                                grades_data.push(module_data);
                            })
                            return callback(undefined, grades_data);
                        })
                    })
                })
            })
        })
    })
}

module.exports.get_user_grades = (user_id, callback) => {
    // we suppose params correct.
    ddb_grades.get_user_grades(user_id, (err, grades) => {
        if (err) {
            return callback(err);
        }
        return callback(undefined, grades)
    })

}

module.exports.set_grade = (user_id, control_id, value, callback) => {
    controls_controller.control_exists(control_id, (err, exists) => {
        if (err) {
            return callback(err);
        }
        if (!exists) {
            return callback(error.get(error.types.ControlNotExists, { message: "Cannot set a grade of an unexistan grade" }));
        }
        ddb_grades.grade_exists(user_id, control_id, (err, exists) => {
            if (err) {
                return callback(err);
            }
            if (exists) {
                ddb_grades.update_grade(user_id, control_id, value, err => {
                    if (err) {
                        return callback(err)
                    }
                    return callback(undefined);
                })
            }
            else {
                ddb_grades.add_grade(user_id, control_id, value, err => {
                    if (err) {
                        return callback(err)
                    }
                    return callback(undefined);
                })
            }
        })
    })
}

module.exports.remove_grades_by_subject = (user_id, subject_id) => {
    controls_types_controller.get_controls_types_with_filters(subject_id, (err, cts) => {
        cts.forEach(ct => {
            controls_controller.get_controls_with_filters(ct.id, (err, controls) => {
                controls.forEach(control => {
                    module.exports.remove_grade(user_id, control.id, (err) => { });
                });
            })
        })
    })
}

module.exports.remove_grade = (user_id, control_id, callback) => {
    ddb_grades.delete_grade(user_id, control_id, err => {
        if (err) {
            return callback(err)
        }
        return callback(undefined);
    })

}

/* RANKING */
module.exports.get_semester_ranking = (semester, callback) => {
    // we suppose params correct.
    ddb_grades.get_semester_ranking(semester, (err, ranking) => {
        if (err) {
            return callback(err);
        }
        return callback(undefined, ranking)
    })

}
