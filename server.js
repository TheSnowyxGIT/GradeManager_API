const http = require("http"); // Need to be updated to https...

/**
 * Load the "./config" that contains all basics informations
 * like the server port
 */
const config = require("./config.json");
require("./config_checker")(); // Check the config



/**
 * Create the server with the script that will holder all requests
 */
const app = require("./requests.js"); // Object that will hold requests
const server = http.createServer(app);

/**
 * Launch the server on the port "config.port"
 */
server.listen(config.port, function(){
    console.log("Server running on " + config.port);
});