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
  ControllersFunctions.logout(req, res, req.user._id, Admin, "Admin");

  // const id = req.body.adminId,
  //   errors = validationResult(req);

  // try {
  //   if (!errors.isEmpty()) {
  //     res.status(400).json({ errors: await GeneralFunctions.validationErrorCheck(errors) });
  //   } 

  //   let admin = await Admin.findById(id);

  //   admin.token = undefined;

  //   await admin.save();

  //   res.status(200).json({
  //     message: "Admin Logout Successful",
  //   });
  // } catch (error) {
  //   res.status(400).json({
  //     error: "Admin Logout Failed, please try again",
  //   });
  // }
};

exports.adminSendResetPasswordLink = async (req, res) => {
  ControllersFunctions.sendResetPasswordLink(req, res, req.body.email, Admin, "Admin", "admin");

  // crypto.randomBytes(32, async (err, buffer) => {
  //   if (err) {
  //     res.status(400).json({ error: "Error Generating Password Reset Token" });
  //   }

  //   const token = buffer.toString("hex"),
  //     email = req.body.mail,
  //     errors = validationResult(req);

  //   let address = "";

  //   try {
  //     if (!errors.isEmpty()) {
  //       res.status(400).json({ errors: await GeneralFunctions.validationErrorCheck(errors) });
  //     } else {
  //       let admin = await Admin.findOne({ email: email });

  //       if (!admin) {
  //         res.status(400).json({ error: "E-Mail Address not Found" });
  //       } 

  //       await Admin.findOne({ email: email }, 
  //         { $set: { resetToken: token, resetTokenExpiration: Date.now() + 3600000 } });

  //       address = GeneralFunctions.environmentCheck(process.env.NODE_ENV);

  //       let from = `Alkebu Lan alkebulan@outlook.com`,
  //         to = admin.companyEmail,
  //         subject = "User Password Reset",
  //         html = `<p>Good Day ${admin.companyName}</p> 
  //               <p>Please click this <a href="${address}/haulage/user/auth/reset/${token}">link</a> to reset your password.`;

  //       const data = {
  //         from: from,
  //         to: to,
  //         subject: subject,
  //         html: html,
  //       };

  //       mailer
  //         .sendEmail(data)
  //         .then((success) => {
  //           res
  //             .status(200)
  //             .json({ message: "Password Reset Link Successfully Sent" });
  //         })
  //         .catch((error) => {
  //           res
  //             .status(400)
  //             .json({ error: "Password Reset Link Failed to Send" });
  //         });

  //     }
  //   } catch (error) {
  //     res.status(400).json({
  //       error: "Error sending password reset token, please try again.",
  //     });
  //   }
  // });
};

exports.adminResetPassword = async (req, res) => {
  ControllersFunctions.resetPassword(req, res, req.params.token, Admin, "Admin");

  // const token = req.params.token;

  // try {
  //   const admin = await Admin.findOne({
  //     resetToken: token,
  //   });

  //   res.status(200).json({
  //     adminId: admin._id.toString(),
  //     passwordToken: token,
  //   });
  // } catch (error) {
  //   res.status(400).json({ error: "Error retrieving Admin" });
  // }
};

exports.adminSetNewPassword = async (req, res) => {
  ControllersFunctions.setNewPassword(req, res, Admin);

  // const newPassword = req.body.newPassword,
  //   adminId = req.body.adminId,
  //   passwordToken = req.body.passwordToken,
  //   errors = validationResult(req);

  // try {
  //   if (!errors.isEmpty()) {
  //     res.status(400).json({ errors: await GeneralFunctions.validationErrorCheck(errors) });
  //   }

  //   let admin = await Admin.findOne({
  //     resetToken: passwordToken,
  //     _id: adminId,
  //   });

  //   let date = new Date();

  //   if (admin.resetTokenExpiration < date) {
  //     res.status(400).json({ error: "Reset Token Expired." });
  //   }

  //   const hashedPassword = await argon2.hash(newPassword);
  //   const access = await AuthFunctions.generateAuthToken(adminId);
  //   const refresh = await Auth.generateRefreshToken(adminId);

  //   admin.password = hashedPassword;
  //   admin.resetToken = undefined;
  //   admin.resetTokenExpiration = undefined;

  //   await admin.save();

  //   res.status(200).json({
  //     message: "Password Reset Successful",
  //     tokens: {
  //       access: {
  //         token: access,
  //         expiresIn: "5m",
  //       },
  //       refresh: {
  //         token: refresh,
  //         expiresIn: "7d"
  //       }
  //     },
  //   });
  // } catch (error) {
  //   res.status(400).json({ error: "Password Reset Failed" });
  // }
};

exports.adminSendConfirmationMail = async (req, res) => {
  ControllersFunctions.sendConfirmationMail(req, res, Admin, "Admin", "admin");

  // crypto.randomBytes(32, async (err, buffer) => {
  //   const token = buffer.toString("hex"),
  //     errors = validationResult(req);

  //   let address = "";

  //   try {
  //     if (!errors.isEmpty()) {
  //       res.status(400).json({ errors: await GeneralFunctions.validationErrorCheck(errors) });
  //     } else {
  //       let admin = await Admin.findById(req.body.adminId);
  //       if (!admin.email) {
  //         res.status(400).json({ error: "E-Mail Address not Registered" });
  //       } else {
  //         address = GeneralFunctions.environmentCheck(process.env.NODE_ENV);

  //         let from = `Energy Direct energydirect@outlook.com`,
  //           to = admin.email,
  //           subject = "Admin Account Confirmation",
  //           html = `<p>Good Day ${admin.username}</p> 
  //                 <p>Please click this <a href="${address}/haulage/admin/auth/confirm/${token}">link</a> to confirm your email.`;

  //         const data = {
  //           from: from,
  //           to: to,
  //           subject: subject,
  //           html: html,
  //         };

  //         admin.confirmationToken = token;
  //         admin.confirmationTokenExpiration = Date.now() + 3600000;

  //         await admin.save();

  //         mailer
  //           .sendEmail(data)
  //           .then((success) => {
  //             res
  //               .status(200)
  //               .json({ message: "E-Mail Confirmation Link Successfully Sent" });
  //           })
  //           .catch((error) => {
  //             res
  //               .status(400)
  //               .json({ error: "E-Mail Confirmation Link Failed to Send" });
  //           });
  //       }
  //     }
  //   } catch (error) {
  //     res.status(400).json({
  //       error: "Error Generating E-Mail Confirmation Token, Please Try Again.",
  //     });
  //   }
  // });
};

exports.adminConfirmMail = async (req, res) => {
  ControllersFunctions.confirmMail(req, res, req.params.token, Admin, "Admin");

  // const token = req.params.token;

  // try {
  //   const admin = await Admin.findOne({
  //     confirmationToken: token,
  //   });

  //   let date = new Date();

  //   if (admin.confirmationTokenExpiration < date) {
  //     res.status(400).json({ error: "Confirmation Token Expired." });
  //   } else {
  //     admin.confirmMail = true;
  //     admin.confirmationToken = undefined;
  //     admin.confirmationTokenExpiration = undefined;

  //     await admin.save();

  //     res.status(200).json({
  //       message: "Admin E-Mail Successfully Confirmed",
  //     });
  //   }
  // } catch (error) {
  //   res.status(400).json({ error: "Admin E-Mail Failed to Confirm" });
  // }
};



exports.hostRegister = (req, res) => {

};

exports.hostLogin = async (req, res) => {

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

