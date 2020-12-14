const { Admin } = require("../models/admin"),
  { Host } = require("../models/host"),
  { User } = require("../models/user"),
  mongoose = require("mongoose"),
  argon2 = require("argon2"),
  crypto = require("crypto"),
  GeneralFunctions = require("../functions/generalFunctions"),
  AuthFunctions = require("../functions/authFunctions"),
  { validationResult } = require("express-validator");

exports.adminLogin = async (req, res) => {
  const errors = validationResult(req);

  try {
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
  const id = req.body.adminId,
    errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: await GeneralFunctions.validationErrorCheck(errors) });
    } 
      
    let admin = await Admin.findById(id);

    admin.token = undefined;

    await admin.save();

    res.status(200).json({
      message: "Admin Logout Successful",
    });
  } catch (error) {
    res.status(400).json({
      error: "Admin Logout Failed, please try again",
    });
  }
};

exports.adminSendResetPasswordLink = (req, res) => {
  
};

exports.adminResetPassword = async (req, res) => {
  
};

exports.adminSetNewPassword = async (req, res) => {
  
};

exports.adminSendConfirmationMail = async (req, res) => {
  
};

exports.adminConfirmMail = async (req, res) => {
  
};



exports.hostLogin = async (req, res) => {
  
};

exports.hostLogout = async (req, res) => {
 
};

exports.hostSendResetPasswordLink = (req, res) => {
  
};

exports.hostResetPassword = async (req, res) => {
  
};

exports.hostSetNewPassword = async (req, res) => {
  
};

exports.hostSendConfirmationMail = async (req, res) => {
  
};

exports.hostConfirmMail = async (req, res) => {
  
};



exports.userLogin = async (req, res) => {
  
};

exports.userLogout = async (req, res) => {
 
};

exports.userSendResetPasswordLink = (req, res) => {
  
};

exports.userResetPassword = async (req, res) => {
  
};

exports.userSetNewPassword = async (req, res) => {
  
};

exports.userSendConfirmationMail = async (req, res) => {
  
};

exports.userConfirmMail = async (req, res) => {
  
};

