const axios = require("axios").default;

module.exports.get_userinfo = (microsoft_token, callback) => {
    const url = 'https://graph.microsoft.com/v1.0/me'
    const config = {
        headers: {
            'Authorization': `Bearer ${microsoft_token}`
        }
    }
    axios.get(url, config).then(result => {
        callback(undefined, result.data)
    }).catch(err => {
        callback(err);
    })
};