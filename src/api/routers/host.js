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
  .route("/event/:id")
    .get(
        authenticate.host,
        hostController.viewEvent
    );

router
  .route("/events")
    .get(
        authenticate.host,
        hostController.viewEvents
    );

module.exports = router;
