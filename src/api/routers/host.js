const express = require("express"),
  router = express.Router(),
  hostController = require("../controllers/host"),
  { body, param } = require("express-validator"),
  authenticate = require("../auth/isAuth");
 
router
  .route("/event/add")
    .post(
        authenticate.host,
        hostController.addEvent
    );
  
router
  .route("/event/edit")
    .patch(
        authenticate.host,
        hostController.editEvent
    );

router
  .route("/event/delete")
    .delete(
        authenticate.host,
        hostController.deleteEvent
    );

router
  .route("/viewEvent/:eventId")
    .get(
        authenticate.host,
        hostController.viewEvent
    );
    
router
  .route("/viewUsers/:eventId")
    .get(
        authenticate.host,
        hostController.viewRegisteredUsers
    );

router
  .route("/viewEvents")
    .get(
        authenticate.host,
        hostController.viewEvents
    );

module.exports = router;
