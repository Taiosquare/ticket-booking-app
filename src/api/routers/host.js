const express = require("express"),
  router = express.Router(),
  hostController = require("../controllers/host"),
  { body, param } = require("express-validator"),
  authenticate = require("../auth/isAuth");

router
  .route("/addEvent")
  .post(
    authenticate.host,
    hostController.addEvent
  );

router
  .route("/editEvent/:eventId")
  .patch(
    authenticate.host,
    hostController.editEvent
  );

router
  .route("/deleteEvent/:eventId")
  .delete(
    authenticate.host,
    hostController.deleteEvent
  );

router
  .route("/verifyTicketPayment/:eventId")
  .put(
    authenticate.host,
    hostController.verifyTicketPayment
  );

router
  .route("/viewRegisteredUsers/:eventId")
  .get(
    authenticate.host,
    hostController.viewRegisteredUsers
  );

router
  .route("/viewEvent/:eventId")
  .get(
    authenticate.host,
    hostController.viewEvent
  );

router
  .route("/viewEvents")
  .get(
    authenticate.host,
    hostController.viewEvents
  );

module.exports = router;
