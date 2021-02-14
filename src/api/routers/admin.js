const express = require("express"),
  router = express.Router(),
  adminController = require("../controllers/admin"),
  { body, param } = require("express-validator"),
  authenticate = require("../auth/isAuth");

router
  .route("/approveHost/:id")
    .put(
        authenticate.admin,
        adminController.approveHost
    );
  
router
  .route("/suspendHost/:id")
    .put(
        authenticate.admin,
        adminController.suspendHost
    );
  
router
  .route("/viewUser/:id")
    .get(
        authenticate.admin,
        adminController.getUser
    );

router
  .route("/viewUsers")
    .get(
        authenticate.admin,
        adminController.getUsers
    );
    
router
  .route("/viewPurchasedTickets/:userId")
    .get(
        authenticate.admin,
        adminController.getTickets
    );
    
router
  .route("/viewHost/:id")
    .get(
        authenticate.admin,
        adminController.getHost
    );

router
  .route("/viewHosts")
    .get(
        authenticate.admin,
        adminController.getHosts
    );
    
router
  .route("/viewEvents/:hostId")
    .get(
        authenticate.admin,
        adminController.getEvents
    );
    
router
  .route("/viewAdmin/:id")
    .get(
      authenticate.admin,
      adminController.getAdministrator
    );

router
  .route("/viewAdmins")
    .get(
      authenticate.admin,
      adminController.getAdministrators
    );
    
router
  .route("/suspendAdmin/:id")
    .put(
      authenticate.admin,
      adminController.suspendAdministrator
    );
    
module.exports = router;
