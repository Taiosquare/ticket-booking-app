const express = require("express"),
    api = express.Router(),
    adminRouter = require("./routers/admin"),
    authRouter = require("./routers/auth"),
    eventRouter = require("./routers/event"),
    hostRouter = require("./routers/host"),
    ticketRouter = require("./routers/ticket"),
    uploadRouter = require('./routers/upload'),
    userRouter = require("./routers/user");

api.use("/admin", adminRouter);
api.use("/auth", authRouter);
api.use("/event", eventRouter);
api.use("/host", hostRouter);
api.use("/ticket", ticketRouter);
api.use("/upload", uploadRouter);
api.use("/user", userRouter);

module.exports = api;
