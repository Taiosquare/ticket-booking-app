const { Admin } = require("../models/admin"),
  { Host } = require("../models/host"),
  { User } = require("../models/user"),
  mongoose = require("mongoose"),
  argon2 = require("argon2"),
  crypto = require("crypto"),
  GeneralFunctions = require("../functions/generalFunctions"),
  ControllersFunctions = require("../functions/controllersFunctions"),
  AuthFunctions = require("../functions/authFunctions"),
  mailer = require("../../services/mailer"),
  { validationResult } = require("express-validator");

exports.adminRegister = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    if (req.admin.superAdmin == false) {
      res.status(400).json({
        error: "Only Super Admins can Add Administrators",
      });
    }

    let admin = await Admin.findOne({ username: req.body.username });

    if (admin) {
      res.status(400).json({
        error: "Username already exists",
      });
    }

    admin = await Admin.findOne({ email: req.body.mail });

    if (admin) {
      res.status(400).json({
        error: "E-Mail Address already registered",
      });
    }

    const hashedPassword = await argon2.hash(req.body.password);
    const id = mongoose.Types.ObjectId();

    const access = await AuthFunctions.generateAuthToken(id);
    const refresh = await AuthFunctions.generateRefreshToken(id);

    const savedObject = await Admin.insertOne({
      _id: id,
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.mail,
      password: hashedPassword,
      approvedHosts: [],
    });

    res.status(201).json({
      message: "Admin successfully added.",
      admin: {
        _id: savedObject._id,
        username: savedObject.username,
        email: savedObject.email,
      },
      tokens: {
        access: {
          token: access,
          expiresIn: "5m",
        },
        refresh: {
          token: refresh,
          expiresIn: "7d"
        }
      },
    });
  } catch (error) {
    res.status(400).json({
      error: "Admin could not be added, please try again.",
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: await GeneralFunctions.validationErrorCheck(errors) });
    }

    let admin = await Admin.findOne({ username: req.body.username });

    if (!admin) {
      res.status(400).json({ error: "Invalid Username or Password" });
    }

    if (admin.accountSuspended == true) {
      res.status(200).json({
        message:
          "Your account has been suspended, please contact a super admin",
      });
    }

    if (await argon2.verify(admin.password, req.body.password)) {
      let refreshToken = await AuthFunctions.generateRefreshToken(admin._id),
        accessToken = await AuthFunctions.generateAuthToken(admin._id);

      admin.token = refreshToken;

      await admin.save();

      res.status(200).json({
        message: "Admin Login Successful",
        admin: {
          _id: admin._id,
          username: admin.username,
          email: admin.email,
        },
        tokens: {
          access: {
            token: accessToken,
            expiresIn: "5m",
          },
          refresh: {
            token: refreshToken,
            expiresIn: "7d"
          }
        },
      });
    } else {
      res.status(400).json({ error: "Invalid Username or Password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Login Process Failed, Please Try Again" });
  }
};

exports.adminLogout = async (req, res) => {
  ControllersFunctions.logout(req, res, req.user._id, Admin, "Admin");
};

exports.adminSendResetPasswordLink = async (req, res) => {
  ControllersFunctions.sendResetPasswordLink(req, res, req.body.email, Admin, "Admin", "admin");
};

exports.adminResetPassword = async (req, res) => {
  ControllersFunctions.resetPassword(req, res, req.params.token, Admin, "Admin");
};

exports.adminSetNewPassword = async (req, res) => {
  ControllersFunctions.setNewPassword(req, res, Admin);
};

exports.adminSendConfirmationMail = async (req, res) => {
  ControllersFunctions.sendConfirmationMail(req, res, Admin, "Admin", "admin");
};

exports.adminConfirmMail = async (req, res) => {
  ControllersFunctions.confirmMail(req, res, req.params.token, Admin, "Admin");
};



exports.hostRegister = (req, res) => {
  try {
    const errors = validationResult(req);

    const { brandName, brandType, brandDescription, brandEmail, password,
      brandWebsite, brandPhoneNumber, brandProfilePicture, address } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    let host = await Host.findOne({
      $or: [{ brandName: brandName },
      { email: brandEmail }]
    });

    if (host) {
      return res.status(400).json({
        error: "Service Provider already registered",
      });
    }

    const hashedPassword = await argon2.hash(password),
      id = mongoose.Types.ObjectId(),
      access = await AuthFunctions.generateAuthToken(id),
      refresh = await AuthFunctions.generateRefreshToken(id);

    const newHost = new Host({
      _id: id,
      brandName: brandName,
      brandType: brandType,
      brandDescription: brandDescription,
      email: brandEmail,
      password: hashedPassword,
      brandWebsite: brandWebsite,
      brandPhoneNumber: brandPhoneNumber,
      brandProfilePicture: brandProfilePicture,
      address: address,
      events: []
    });

    const savedObject = await newHost.save();

    res.status(201).json({
      message: "Host successfully registered.",
      host: {
        _id: savedObject._id,
        name: savedObject.brandName,
        email: savedObject.email,
      },
      tokens: {
        access: {
          token: access,
          expiresIn: "5m",
        },
        refresh: {
          token: refresh,
          expiresIn: "7d"
        }
      },
    });
  } catch (error) {
    res.status(400).json({
      error: "Host could not be registered, please try again.",
    });
  }
};

exports.hostLogin = async (req, res) => {
  try {
    const errors = validationResult(req);

    const { brandEmail, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    let host = await Host.findOne({
      email: brandEmail,
    });

    if (!host) {
      return res.status(400).json({
        error: "Invalid Email or Password"
      });
    }

    if (await argon2.verify(host.password, password)) {
      let refreshToken = await AuthFunctions.generateRefreshToken(host._id),
        accessToken = await AuthFunctions.generateAuthToken(host._id);

      host.token = refreshToken;

      await host.save();

      res.status(200).json({
        message: "Host Login Successful",
        host: {
          _id: host._id,
          name: host.brandName,
          email: host.brandEmail,
        },
        tokens: {
          access: {
            token: accessToken,
            expiresIn: "5m",
          },
          refresh: {
            token: refreshToken,
            expiresIn: "7d"
          }
        },
      });
    } else {
      res.status(400).json({
        error: "Invalid Email or Password"
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Login Process Failed, Please Try Again" });
  }
};

exports.hostLogout = async (req, res) => {
  ControllersFunctions.logout(req, res, req.user._id, Host, "Host");
};

exports.hostSendResetPasswordLink = (req, res) => {
  ControllersFunctions.sendResetPasswordLink(req, res, req.body.email, Host, "Host", "host");
};

exports.hostResetPassword = async (req, res) => {
  ControllersFunctions.resetPassword(req, res, req.params.token, Host, "Host");
};

exports.hostSetNewPassword = async (req, res) => {
  ControllersFunctions.setNewPassword(req, res, Host);
};

exports.hostSendConfirmationMail = async (req, res) => {
  ControllersFunctions.sendConfirmationMail(req, res, Host, "Host", "host");
};

exports.hostConfirmMail = async (req, res) => {
  ControllersFunctions.confirmMail(req, res, req.params.token, Host, "Host");
};



exports.userRegister = (req, res) => {

};

exports.userLogin = async (req, res) => {

};

exports.userLogout = async (req, res) => {
  ControllersFunctions.logout(req, res, req.user._id, User, "User");
};

exports.userSendResetPasswordLink = (req, res) => {
  ControllersFunctions.sendResetPasswordLink(req, res, req.body.email, User, "User", "user");
};

exports.userResetPassword = async (req, res) => {
  ControllersFunctions.resetPassword(req, res, req.params.token, User, "User");
};

exports.userSetNewPassword = async (req, res) => {
  ControllersFunctions.setNewPassword(req, res, User);
};

exports.userSendConfirmationMail = async (req, res) => {
  ControllersFunctions.sendConfirmationMail(req, res, User, "User", "user");
};

exports.userConfirmMail = async (req, res) => {
  ControllersFunctions.confirmMail(req, res, req.params.token, User, "User");
};

