const express = require("express"),
  router = express.Router(),
  userController = require("../controllers/user"),
  { body, param } = require("express-validator"),
  authenticate = require("../auth/isAuth");
 
router
  .route("/searchEvents")
    .get(
        authenticate.user,
        userController.searchEvents
    );
  
router
  .route("/rateEvent")
    .put(
        authenticate.user,
        userController.rateEvent
    );

router
  .route("/bookEvent")
    .post(
        authenticate.user,
        userController.bookEvent
    );

router
  .route("/ticketPurchase/bank/:eventId")
    .post(
        authenticate.user,
        userController.bankPayment
);
    
router
  .route("/verifyTicketPurchase/bank/:eventId")
    .put(
        authenticate.user,
        userController.verifyBankPayment
);
    
router
  .route("/ticketPurchase/ussd/:eventId")
    .post(
        authenticate.user,
        userController.ussdPayment
);
    
router
  .route("/verifyTicketPurchase/ussd/:eventId")
    .put(
        authenticate.user,
        userController.verifyUssdPayment
    );
    
router
  .route("/printTicket")
    .get(
        authenticate.user,
        userController.printTicket
    );

router
  .route("/viewEvent/:id")
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
    
module.exports = router;
