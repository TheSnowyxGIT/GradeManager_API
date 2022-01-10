/**
 * Depedencies declarations
 */
const express = require("express");


/**
 * Requests holding
 */
const app = express();
app.use(express.json());


const auth_router = require("./routes/auth");
app.use("/auth", auth_router);

const users_router = require("./routes/users");
app.use("/users", users_router);

const subjects_router = require("./routes/subjects");
app.use("/subjects", subjects_router);

const controls_types_router = require("./routes/controls_types");
app.use("/controls_types", controls_types_router);

const grades_router = require("./routes/grades");
app.use("/grades", grades_router);

module.exports = app;
