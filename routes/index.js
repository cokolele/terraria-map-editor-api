const router = require("express").Router();
const authRouter = require("./auth.js");
const apiRouter = require("./api.js");

/*
auth server routes
*/

router.use("/auth", authRouter);

router.all("/auth", (req, res) => {
    res.responses.success("Auth running");
});

/*
api endpoints routes
*/

router.use("/api", apiRouter);

router.all("/api", (req, res) => {
    res.responses.success("API running");
});

/*
unimplemented routes
*/

router.all(["/api/*", "/auth/*"], (req, res) => {
    res.responses.notImplemented();
})

router.use((req, res) => {
    res.responses.generic("Terraria map editor API");
})

module.exports = router;
