const express = require("express"),
    api = express.Router(),
    authRouter = require("./routers/auth"),
    adminRouter = require("./routers/admin"),
    hostRouter = require("./routers/host"),
    // uploadRouter = require('./routers/upload'),
    userRouter = require("./routers/user");

api.use("/auth", authRouter);
api.use("/admin", adminRouter);
api.use("/host", hostRouter);
// api.use("/upload", uploadRouter);
api.use("/user", userRouter);

module.exports = api;
