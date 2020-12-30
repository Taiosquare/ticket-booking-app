const express = require("express"),
  router = express.Router(),
  authController = require("../controllers/auth"),
  { body, param } = require("express-validator"),
  passportFacebook = require('../auth/facebook'),
  authenticate = require("../auth/isAuth");

// Admin Auth 
router
  .route("/admin/login")
    .post(authController.adminLogin);
  
router.route("/admin/logout")
  .post(
    authenticate.admin,
    authController.adminLogout
);

router
  .route("/admin/recover")
  .patch(
    authController.adminSendResetPasswordLink
  );

router.route("/admin/reset/:token").get(authController.adminResetPassword);

router
  .route("/admin/newPassword")
  .patch(
    authController.adminSetNewPassword
  );

router.route("/admin/confirm")
  .post(
    authController.adminSendConfirmationMail
  );

router.route("/admin/confirm/:token").get(authController.adminConfirmMail);



// Host Auth 
router
  .route("/host/login")
    .post(authController.hostLogin);
  
router.route("/host/logout")
  .post(
    authenticate.host,
    authController.hostLogout
);

router
  .route("/host/recover")
  .patch(
    authController.hostSendResetPasswordLink
  );

router.route("/host/reset/:token").get(authController.hostResetPassword);

router
  .route("/host/newPassword")
  .patch(
    authController.hostSetNewPassword
  );

router.route("/host/confirm")
  .post(
    authController.hostSendConfirmationMail
  );

router.route("/host/confirm/:token").get(authController.hostConfirmMail);



// User Auth
router
  .route("/user/login")
  .post(authController.userLogin);
  
router.route("/user/logout")
  .post(
    authenticate.user,
    authController.userLogout
  );

router
  .route("/user/recover")
  .patch(
    authController.userSendResetPasswordLink
  );

router.route("/user/reset/:token").get(authController.userResetPassword);

router
  .route("/user/newPassword")
  .patch(
    authController.userSetNewPassword
  );

router.route("/user/confirm")
  .post(
    authController.userSendConfirmationMail
  );

router.route("/user/confirm/:token").get(authController.userConfirmMail);

router.route("/user/facebook")
  .get(
    passportFacebook.authenticate('facebook')
  );

router.route('/user/facebook/callback')
  .get(
    passportFacebook.authenticate('facebook', { failureRedirect: '/user/login' }),
    (req, res) => {
      res.redirect('/'); //redirect to home
    }
  );

module.exports = router;
