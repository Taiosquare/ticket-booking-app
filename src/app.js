require("./db/mongoose.js");
require("dotenv").config();

const express = require("express"),
  bodyParser = require("body-parser"),
  helmet = require("helmet"),
  compression = require("compression"),
  passport = require("passport"),
  session = require("express-session");

const app = express();

const api = require("./api/api"),
  errorController = require("./api/controllers/error");

app.use(helmet());
app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 's3cr3t',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(api);

app.use(errorController.get404);

module.exports = { app };
