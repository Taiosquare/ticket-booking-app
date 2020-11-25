const express = require("express"),
  router = express.Router(),
  authController = require("../controllers/auth"),
  { body, param } = require("express-validator"),
  authenticate = require("../auth/auth");

// Admin Auth 
router
  .route("/admin/login")
    .post(authController.adminLogin);
  
router.route("/admin/logout")
  .post(
    authenticate,
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



// User Auth
router
  .route("/user/login")
  .post(authController.userLogin);
  
router.route("/user/logout")
  .post(
    authenticate,
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

module.exports = router;
