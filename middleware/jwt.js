const jwt = require("jsonwebtoken");
const {error} = require("./sender/sender");

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
/**
 * Check credentials and store data in req.payload
 */
module.exports.check_token = (req, res, next) =>
{
    if (!req.headers['authorization']) {
        return error.send(res, error.types.NoCredentials, {
            message: 'No credentials sent.'
        });
    }
    const authHeader = req.headers['authorization'];
    const authHeader_split = authHeader.split(' ');
    if (authHeader_split.length != 2 || authHeader_split[0] !== "Bearer"){
        return error.send(res, error.types.CredentialsInvalid, {
            message: 'Authorization header invalid.'
        });
    }
    const token = authHeader_split[1];
    
    const token_payload = this.verifyAccessToken(token);
    if(!token_payload) {
        return error.send(res, error.types.TokenInvalid, {
            message: 'Your token is incorrect or has expired.'
        });
    }
    
    req.payload = token_payload;
    next();
}