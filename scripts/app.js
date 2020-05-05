const mysql = require("mysql");
const express = require("express");
const app = express();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");

const routes = require("../routes/index.js");
const createResponses = require("../responses.js");

let dbConnection;

const onDBDisconnect = () => {
    dbConnection = null;
}

const onDBReconnect = (_dbConnection) => {
    dbConnection = _dbConnection;
}

const create = (config, _dbConnection) => {
    app.set("config", config);

    dbConnection = _dbConnection

    //express session setup
    const sessionSettings = {
        cookie: {
            httpOnly: true,
            maxAge: 2592000000,
        },
        name: "tweSessId",
        store: new MySQLStore({}, dbConnection),
        secret: config.secrets.sessionSecret,
        resave: false,
        saveUninitialized: false,
        rolling: true
    }
    if (app.get("config").env == "production") {
        app.set("trust proxy", 1)
        sessionSettings.cookie.secret = true;
    }
    app.use((req, res, next) => {
        if (dbConnection !== null) {
            session(sessionSettings);
        }
        next();
    });

    //bodyParser setup
    app.use((req, res, next) => {
        if (req.headers["content-type"] && (req.headers["content-type"].includes("application/octet-stream") || req.headers["content-type"].includes("multipart/form-data"))) {
            app.use(bodyParser.urlencoded({ extended : true }));
            app.use(bodyParser.json());
        }
        next();
    });

    //morgan and helmet setup
    if (app.get("config").env == "production") {
        const logsDir = path.join(config.serverRootDir, "/logs");
        if (!fs.existsSync(logsDir))
            fs.mkdirSync(logsDir);
        app.use(morgan("common", {
            stream: fs.createWriteStream(path.join(logsDir, "/api-access.log"), { flags: "a" })
        }));
    }
    app.use(helmet());

    //routes
    app.use((req, res, next) => {
        res.responses = createResponses(res);

        if (dbConnection === null)
            res.responses.serviceUnavailable("Couldn't connect to database. Please try again later");

        next();
    })
    app.use(routes);
};

const start = (callback) => {
    app.listen(app.get("config").port, callback);
};

module.exports = {
    create,
    start,
    onDBDisconnect,
    onDBReconnect
};
