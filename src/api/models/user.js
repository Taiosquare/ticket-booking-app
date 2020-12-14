const mongoose = require("mongoose"),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema,
  jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    verifiedMail: {
      type: Boolean,
      default: false,
    },

    accountSuspended: {
      type: Boolean,
      default: false,
    },

    events: {
        type: [Schema.Types.ObjectId],
        ref: "event",
    },

    loggedIn: String,

    confirmationToken: String,

    confirmTokenExpiration: Date,

    resetToken: String,

    resetTokenExpiration: Date,
  },
  {
    autoCreate: true,
    strict: false,
    autoIndex: false,
    timestamps: true,
  }
);

const User = mongoose.model("user", UserSchema);

module.exports = { User };
