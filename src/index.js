require("dotenv").config();

const { app } = require("./app"),
  port = process.env.PORT;

const server = app.listen(port);

const io = require("./socket").init(server);

io.on("connection", (socket) => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };
