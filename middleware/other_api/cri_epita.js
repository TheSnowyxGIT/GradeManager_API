const axios = require("axios").default;

const config = require("../../config.json"); // load the config

const {error} = require("../sender/sender")

function find_campus_in_string(str) {
    if (typeof str != "string") {
        return "";
    }
    str = str.toLowerCase();
    const campus = {
        tls: ["tls", "toulouse"],
        prs: ["prs", "paris"],
        lyn: ["lyn", "lyon"],
        rns: ["rns", "rennes"],
        stg: ["stg", "strasbourg"]
    }
    let find_campus = "";
    Object.keys(campus).forEach(key => {
        if (find_campus !== "") { return; }
        const array = campus[key];
        array.forEach(prefix => {
            if (str.includes(prefix)) {
                find_campus = key;
            }
        })
    });
    return find_campus;
}

function find_semester_in_string(str) {
    if (typeof str != "string") {
        return "";
    }
    str = str.toLowerCase();
    let semester_find = "";
    for (let i = 0; i <= 10; i++) {
        const prefix = `-s${i}-`;
        if (str.includes(prefix)) {
            semester_find = "s" + i;
            break;
        }
    }
    return semester_find;
}

/**
 * Get the cri epita userinfo
 * The data from cri epita will be arranged
 */
module.exports.get_userinfo = (mail, callback) => {
    const cri_url = `https://cri.epita.fr/api/v2/users/search/?emails=${mail}`;
    const cri_config = {
        headers: {
            "accept": "application/json",
            "X-CSRFToken": `${config.CRI.CSRF_TOKEN}`,
            "authorization": `Basic bHVrYXMuZGVyb256aWVyOlNheG9waG9uZTE=`
        }
    };
    axios.get(cri_url, cri_config).then(result_cri => {
        if (result_cri.data.count == 0) {
            return callback(error.get(error.types.Unauthorized, {
                message: 'No account find on the cri Epita for the email given.',
                email: mail
            }));
        }
        const user = result_cri.data.results[0];

        // Get the campus from data
        let groups = user.groups_history;
        groups = groups.sort((a, b) => (new Date(a.end_at) < new Date(b.end_at)) ? 1 : -1).map(obj => obj.group);
        let campus_list = groups;
        campus_list = campus_list.map(obj => find_campus_in_string(obj.slug));
        campus_list = campus_list.filter(str => str != "");
        let campus = ""; // user campus
        if (campus_list.length > 0) {
            campus = campus_list[0];
        }

        // Get the semester from data
        let semester_list = groups;
        semester_list = semester_list.map(obj => find_semester_in_string(obj.slug));
        semester_list = semester_list.filter(str => str != "");
        let semester = ""; // user semester
        if (semester_list.length > 0) {
            semester = semester_list[0];
        }


        /**
         * HARDCODE 
         */
        if (mail == "thomas.peugnet@epita.fr")
        {
            semester = "s5";
        }
        if (mail == "adrien.pingard@epita.fr")
        {
            semester = "s5";
        }
        

        const data = {
            login: user.login,
            status: user.primary_group.slug || "",
            campus: campus,
            semester: semester
        }
        callback(undefined, data); // return
    }).catch((err)=>{
        return callback(error.get(error.types.InternRequestFailed, {
            message: 'Request to the cri epita api failed.',
            error: err
        }));
    })
    
}
