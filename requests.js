/**
 * Depedencies declarations
 */
const express = require("express");


/**
 * Requests holding
 */
const app = express();


const auth_router = require("./routes/auth");
app.use("/auth", auth_router);


module.exports = app;
