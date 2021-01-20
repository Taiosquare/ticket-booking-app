const express = require("express"),
  router = express.Router(),
  userController = require("../controllers/user"),
  { body, param } = require("express-validator"),
  authenticate = require("../auth/isAuth");
 
router
  .route("/events/search")
    .post(
        authenticate.user,
        userController.searchEvents
    );
  
router
  .route("/event/rate")
    .patch(
        authenticate.user,
        userController.rateEvent
    );

router
  .route("/event/book")
    .delete(
        authenticate.user,
        userController.bookEvent
    );

router
  .route("/event/purchase")
    .get(
        authenticate.user,
        userController.purchaseTicket
    );
    
router
  .route("/event/purchase")
    .get(
        authenticate.user,
        userController.printTicket
    );

router
  .route("/viewEvent/:eventId")
    .get(
        authenticate.user,
        userController.viewEvent
);

router
  .route("/viewEvents")
    .get(
        authenticate.user,
        userController.viewBookedEvents
);
    
router
  .route("/success")
    .post(
        userController.paymentSuccess
    );

module.exports = router;
