const mongoose = require("mongoose"),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema,
  jwt = require("jsonwebtoken");

const AdminSchema = new Schema(
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

    superAdmin: {
      type: Boolean,
      default: false,
    },

    accountSuspended: {
      type: Boolean,
      default: false,
    },

    approvedHosts: {
        type: [Schema.Types.ObjectId],
        ref: "host",
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

AdminSchema.statics.generateAuthToken = function (id) {
  let token = jwt
    .sign(
      {
        _id: id,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "5m",
      }
    )
    .toString();

  return token;
};

AdminSchema.statics.generateRefreshToken = function (id) {
  let refresh = jwt
    .sign(
      {
        _id: id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    )
    .toString();
  
  return refresh;
};

const Admin = mongoose.model("admin", AdminSchema);

module.exports = { Admin };
