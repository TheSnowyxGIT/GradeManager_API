module.exports.types = {
    Unauthorized: { type: "Unauthorized", code: 401 },
    NoCredentials: { type: "NoCredentials", code: 403 },
    CredentialsInvalid: { type: "CredentialsInvalid", code: 403 },

    TokenInvalid: { type: "TokenInvalid", code: 401 },

    InternRequestFailed: { type: "InternRequestFailed", code: 500 },
    RequestInvalid: { type: "RequestInvalid", code: 400 },
    UnknownUser: { type: "UnknownUser", code: 403 },

    UnknownRank: { type: "UnknownRank", code: 403 },
    RankAlreadyHavePermission: { type: "RankAlreadyHavePermission", code: 403 },
    RankAlreadyExists: { type: "RankAlreadyExists", code: 403 },
    UserAlreadyHaveRank: { type: "UserAlreadyHaveRank", code: 403 },
    UserNotHaveRank: { type: "UserNotHaveRank", code: 403 },

    GradeAlreadyExists: { type: "GradeAlreadyExists", code: 403 },
    GradeNotExists: { type: "GradeAlreadyExists", code: 403 },

    SubjectAlreadyExists: { type: "SubjectAlreadyExists", code: 403 },
    SubjectNotExists: { type: "SubjectNotExists", code: 403 },

    ControlTypeAlreadyExists: { type: "ControlTypeAlreadyExists", code: 403 },
    ControlTypeNotExists: { type: "ControlTypeNotExists", code: 403 },

    ControlAlreadyExists: { type: "ControlAlreadyExists", code: 403 },
    ControlNotExists: { type: "ControlNotExists", code: 403 },

    MysqlError: { type: "MysqlError", code: 500 },
    PermissionSyntax: { type: "PermissionSyntax", code: 403 },

    FileAlreadyExists: { type: "FileAlreadyExists", code: 403 },
    FileNotExists: { type: "FileNotExists", code: 403 },
    DirectoryAlreadyExists: { type: "DirectoryAlreadyExists", code: 403 },
    DirectoryNotExists: { type: "DirectoryNotExists", code: 403 },
    PathExists: { type: "PathExists", code: 403 },
    PathNotExists: { type: "PathNotExists", code: 403 },
    FSError: { type: "FSError", code: 500 },

    UserNotHaveSemester: { type: "UserNotHaveSemester", code: 403 },

    Drive_Unauthorized: { type: "Drive_Unauthorized", code: 401 }
}


/* express */
module.exports.get = (type, err) => {
    let code = type.code;
    err.type = type.type;
    return { status: code, error: err }
}

module.exports.send = (res, type, err) => {
    const e = this.get(type, err);
    res.status(e.status).json({ status: "ERROR", error: e.error });
}

module.exports.send_err = (res, error) => {
    res.status(error.status).json({ status: "ERROR", error: error.error });
}

/* System */
module.exports.throw = (message) => {
    throw new Error(message);
}
