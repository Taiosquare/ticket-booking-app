const express = require("express"),
  router = express.Router(),
  authController = require("../controllers/auth"),
  passportFacebook = require('../auth/facebook'),
  authenticate = require("../auth/isAuth");

router
  .route("/register")
  .post(authController.register);

router
  .route("/login")
  .post(authController.login);

router.route("/logout")
  .post(
    authenticate.admin,
    authController.adminLogout
  );

router.route("/host/logout")
  .post(
    authenticate.host,
    authController.hostLogout
  );

router.route("/user/logout")
  .post(
    authenticate.user,
    authController.userLogout
  );

router
  .route("/recover")
  .post(
    authController.sendResetPasswordLink
  );

router.route("/reset/:token").get(authController.resetPassword);

router
  .route("/newPassword")
  .patch(
    authController.setNewPassword
  );

router.route("/confirm/:token").get(authController.confirmMail);

router.route("/user/facebook")
  .get(
    passportFacebook.authenticate('facebook')
  );

router.route('/user/facebook/redirect')
  .get(
    passportFacebook.authenticate('facebook', { failureRedirect: '/user/login' }),
    (req, res) => {
      res.redirect('/');
    }
  );

module.exports = router;
