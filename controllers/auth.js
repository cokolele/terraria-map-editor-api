const userModel = require("../models/user.js");
const isemail = require("isemail")

module.exports = {
    getUser: async (req, res) => {
        if (req.session.loggedIn)
            res.responses.successData(req.session.user);
        else
            res.responses.unauthorized("Not logged in");
    },

    login: async (req, res) => {
        if (req.session.loggedIn)
            return res.responses.unprocessable("Already logged in");

        if (req.body === undefined || req.body.username === undefined || req.body.password === undefined)
            return res.responses.unprocessable("Missing parameters");

        if (req.body.username.trim().length === 0 || !userModel.usernameRegexp.test(req.body.username))
            return res.responses.unprocessable("Invalid username");

        if (req.body.password.trim().length === 0 || req.body.password.length > 55)
            return res.responses.unprocessable("Invalid password");

        const userSameCredentials = await userModel.getUserByCredentials(req.body.username, req.body.password);

        if (userSameCredentials === false)
            return res.responses.internal_error();

        if (userSameCredentials.error)
            return res.responses.unprocessable(userSameCredentials.error);

        req.session.user = userSameCredentials[0];
        req.session.loggedIn = true;

        res.responses.success("Logged in", {
            user: userSameCredentials[0]
        });
    },

    logout: async (req, res) => {
        if (req.session.loggedIn) {
            delete req.session.user;
            req.session.loggedIn = false;
            res.responses.success("Logged out");
        } else
            res.responses.unauthorized("Not logged in");
    },

    registration: async (req, res) => {
        if (req.body === undefined || req.body.username === undefined || req.body.password === undefined || req.body.email === undefined)
            return res.responses.unprocessable("Missing parameters");

        if (req.body.username.trim().length === 0 || !userModel.usernameRegexp.test(req.body.username))
            return res.responses.unprocessable("Invalid username");

        if (req.body.password.trim().length === 0 || req.body.password.length > 55)
            return res.responses.unprocessable("Invalid password");

        if (!isemail.validate(req.body.email))
            return res.responses.unprocessable("Invalid email");

        const userSaved = await userModel.saveUser(req.body.username, req.body.password, req.body.email);

        if (userSaved === false)
            return res.responses.internal_error();

        if (userSaved.error)
            return res.responses.unprocessable(userSaved.error);

        const userLoggedIn = await userModel.getUserByCredentials(req.body.username, req.body.password);

        if (userSaved === false)
            return res.responses.internal_error();

        req.session.user = userLoggedIn[0];
        req.session.loggedIn = true;

        res.responses.success("Registered", {
            user: userLoggedIn[0]
        });
    }
}