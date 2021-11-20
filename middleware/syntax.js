module.exports.array = (syntax_fct, array) => {
    let good = true;
    Object.values(array).forEach(value => {
        good = good && syntax_fct(value);
    })
    return good;
}

module.exports.notempty_string = (value) => {
    return typeof value === "string" && value !== "";
}

module.exports.rank = (rank) => {
    return !(typeof rank != "string" || rank === "" || !rank.match("^[a-zA-Z]([a-zA-Z]+)?$"))
}

module.exports.ranks_array = (ranks) => {
    let good = typeof ranks == "object";
    Object.values(ranks).forEach(value => {
        good = good && module.exports.rank(value);
    })
    return good;
}

module.exports.grade_name = (grade_name) => {
    return typeof grade_name == "string" && grade_name != "";
}

module.exports.grade_type = (grade_name) => {
    return typeof grade_name == "string" && grade_name != "" && grade_name.match("^[a-z1-9-]+$");
}


module.exports.module_name = (module_name) => {
    return typeof module_name == "string" && (module_name.match("^[a-zA-Z-]+$") || module_name == "none");
}

module.exports.semester = (semester) => {
    return typeof semester == "string" && (semester.match("^[s][0-9][0-9]?$") || semester == "none");
}

module.exports.id = (id) => {
    return typeof id == "number" && !isNaN(id) && id >= 0
}

module.exports.name = (name) => {
    return typeof name == "string" && name != "";
}

module.exports.status = (status) => {
    return typeof status == "string" && (status == "teachers" || status == "students" || status == "none");
}

module.exports.login = (login) => {
    return typeof login == "string" && login != "" && login.match("^([a-z0-9-]+)[.]([a-z0-9-]+)$");
}

module.exports.mail = (mail) => {
    return typeof mail == "string" && mail != "" && mail.match("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
}

module.exports.campus = (campus) => {
    return typeof campus == "string" && campus != ""
}

module.exports.permission = permission => {
    if (typeof permission != "string" || !permission.match("^([a-z1-9*]+)(([.][a-z1-9*]+)+)?$")) {
        return false;
    }
    return true;
}

module.exports.subject = subject => {
    if (typeof subject != "string" || !subject.match("^[a-z]+$")) {
        return false;
    }
    return true;
}

module.exports.filePath = (file_path) => {
    if (typeof file_path != "string" || file_path == "" || !file_path.match("^((?:[^\/]*\/)*)(.*)[^\/]$")) {
        return false;
    }
    return true;
}
module.exports.dirpath = (path) => {
    if (typeof path != "string" || path == "" || !path.match("^([a-zA-Z0-9_-]+)?((\/[a-zA-Z0-9_-]+)+)?\/?$")) {
        return false;
    }
    return true;
}