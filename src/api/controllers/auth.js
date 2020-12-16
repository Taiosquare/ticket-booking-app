const { Admin } = require("../models/admin"),
  { Host } = require("../models/host"),
  { User } = require("../models/user"),
  mongoose = require("mongoose"),
  argon2 = require("argon2"),
  crypto = require("crypto"),
  GeneralFunctions = require("../functions/generalFunctions"),
  AuthFunctions = require("../functions/authFunctions"),
  mailer = require("../../services/mailer"),
  { validationResult } = require("express-validator");

exports.adminRegister = (req, res) => {
  res.setHeader('access-token', req.token);
  const errors = validationResult(req);

  try {
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
    let id = mongoose.Types.ObjectId();

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
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      res.status(400).json({ error: "Error Generating Password Reset Token" });
    }

    const token = buffer.toString("hex"),
      email = req.body.mail,
      errors = validationResult(req);
    
    let address = "";

    try {
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: await GeneralFunctions.validationErrorCheck(errors) });
      } else {
        let admin = await Admin.findOne({ email: email });

        if (!admin) {
          res.status(400).json({ error: "E-Mail Address not Found" });
        } 

        await Admin.findOne({ email: email }, 
          { $set: { resetToken: token, resetTokenExpiration: Date.now() + 3600000 } });
        
        address = GeneralFunctions.environmentCheck(process.env.NODE_ENV);

        let from = `Alkebu Lan alkebulan@outlook.com`,
          to = admin.companyEmail,
          subject = "User Password Reset",
          html = `<p>Good Day ${admin.companyName}</p> 
                <p>Please click this <a href="${address}/haulage/user/auth/reset/${token}">link</a> to reset your password.`;

        const data = {
          from: from,
          to: to,
          subject: subject,
          html: html,
        };

        mailer
          .sendEmail(data)
          .then((success) => {
            res
              .status(200)
              .json({ message: "Password Reset Link Successfully Sent" });
          })
          .catch((error) => {
            res
              .status(400)
              .json({ error: "Password Reset Link Failed to Send" });
          });
        
      }
    } catch (error) {
      res.status(400).json({
        error: "Error generating password reset token, please try again.",
      });
    }
  });
};

exports.adminResetPassword = async (req, res) => {
  const token = req.params.token;

  try {
    const admin = await Admin.findOne({
      resetToken: token,
    });

    res.status(200).json({
      adminId: admin._id.toString(),
      passwordToken: token,
    });
  } catch (error) {
    res.status(400).json({ error: "Error retrieving Admin" });
  }
};

exports.adminSetNewPassword = async (req, res) => {
  
};

exports.adminSendConfirmationMail = async (req, res) => {
  
};

exports.adminConfirmMail = async (req, res) => {
  
};



exports.hostRegister = (req, res) => {
  
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



exports.userRegister = (req, res) => {
  
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

