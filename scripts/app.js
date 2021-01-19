const app = require("express")();
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
const { validateDirectory } = require("../utils/utils.js");

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
    validateDirectory(config.contentDir);

    dbConnection = _dbConnection;

    //bodyParser setup
    app.use(bodyParser.json({
        type: "application/json"
    }));

    //morgan and helmet setup
    if (app.get("config").env == "production") {
        const logsDir = path.join(config.serverRootDir, "/logs");
        validateDirectory(logsDir);
        app.use(morgan("common", {
            stream: fs.createWriteStream(path.join(logsDir, "/api-access.log"), { flags: "a" })
        }));
    }
    app.use(helmet());

    //express session setup
    const sessionSettings = {
        cookie: {
            httpOnly: true,
            maxAge: 2592000000,
            sameSite: "none"
        },
        name: "tweSessId",
        secret: config.secrets.sessionSecret,
        store: null,
        resave: false,
        rolling: true,
        saveUninitialized: false
    }
    if (app.get("config").env == "production") {
        app.set("trust proxy", 1)
        sessionSettings.cookie.secure = true;
    }
    app.use((req, res, next) => {
        if (dbConnection) {
            if (!sessionSettings.store)
                sessionSettings.store = new MySQLStore({}, dbConnection);
            session(sessionSettings)(req, res, next);
        } else {
            sessionSettings.store = null;
            next();
        }
    });

    //routes
    app.use((req, res, next) => {
        res.responses = createResponses(res);

        if (!dbConnection) {
            res.responses.serviceUnavailable("Couldn't connect to database. Please try again later");
            res.end();
        } else {
            next();
        }
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
