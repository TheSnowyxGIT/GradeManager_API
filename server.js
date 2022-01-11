const https = require("https");
const fs = require('fs');

/**
 * Load the "./config" that contains all basics informations
 * like the server port
 */
const config = require("./config.json");
require("./config_checker")(); // Check the config

/**
 * Get ssl certificate for the https
 */
const options = {
    key: fs.readFileSync(config.SSL.privkey),
    cert: fs.readFileSync(config.SSL.fullchain)
};

/**
 * Create the server with the script that will holder all requests
 */
const app = require("./requests.js"); // Object that will hold requests
const server = https.createServer(options, app);


/**
 * Launch the server on the port "config.port"
 */
server.listen(config.port, function(){
    console.log("Server running on " + config.port);
});
