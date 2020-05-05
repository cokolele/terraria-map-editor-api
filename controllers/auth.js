const userModel = require("../models/user.js");

module.exports = {
    login: async (req, res) => {
        res.responses.success("ok1");
    },

    logout: async (req, res) => {
        res.responses.success("ok2");
    },

    register: async (req, res) => {
        res.responses.success("ok3");
    }
}