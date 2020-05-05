const express = require("express");
const apiRouter = express.Router();

const authRouter = require("./auth.js");

apiRouter.use("/", authRouter);

apiRouter.all("/api", (req, res) => {
    res.responses.success("API running");
});

apiRouter.all("/api/*", (req, res) => {
    res.responses.notImplemented();
})

apiRouter.use((req, res) => {
    res.responses.generic("Terraria map editor API");
})

module.exports = apiRouter;
