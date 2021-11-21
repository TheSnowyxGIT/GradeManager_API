const jwt = require("jsonwebtoken");

const config = require("../config.json");

module.exports.generateAccessToken = (user) =>
{
    const opt = {};
    if (config.JWT.expire == true)
    {
        opt.expiresIn = config.JWT.lifetime;
    }
    return jwt.sign(user, config.JWT.secret, opt);
}

/**
 * 
 * Verify if the token is good.
 * return the payload of the token if the token is good,
 * undefined otherwise
 */
module.exports.verifyAccessToken = (token) =>
{
    try {
        return jwt.verify(token, config.JWT.secret);
    } catch (error) {
        return undefined;
    }
}