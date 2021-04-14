require("dotenv").config();

const { Event } = require("../models/event"),
  { User } = require("../models/user"),
  GeneralFunctions = require("../functions/generalFunctions"),
  EventFunctions = require("../functions/eventFunctions"),
  { validationResult } = require("express-validator");

exports.searchEvents = async (req, res) => {
  // Search Criterias: title, category, isVirtual, isPublic, location, dates
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const keyword = req.body.keyword || "";

    const events = await Event.find(
      { $text: { $search: keyword } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .select("title category location dates")

    //events == null ? events = :

    res.status(200).json({
      events: events
    });
  } catch (error) {
    res.status(400).json({
      error: "error Fetching Events",
    });
  }
}

exports.rateEvent = async (req, res) => {
  res.setHeader('access-token', req.token);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const id = req.params.eventId,
      rating = req.body.rating;

    await User.updateOne(
      { _id: req.user._id },
      {
        $set: {
          "ratedEvents.id": id,
          "ratedEvents.rating": rating
        }
      }
    );

    let event = await Event.findById(id);

    // let user = await User.findById(req.user._id);

    event.rating.numofRatings++;
    event.rating.averageScore = (event.rating.averageScore + rating) / event.rating.numofRatings;

    // user.ratedEvents.id = id;
    // user.ratedEvents.rating = rating;

    await event.save();
    // await user.save();

    res.status(200).json({
      message: 'Event successfully rated'
    });
  } catch (error) {
    res.status(400).json({
      error: "Error Rating Event, please try again.",
    });
  }
}

exports.bookEvent = async (req, res) => {
  // Rename to eventBankPayment
  // use event details for initiating payment
  // 2nd request should be eventBankPaymentVerification
  // The details should then be saved there
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const { eventId, userId, spacesBooked, payment: { email, amount, bank, birthday } } = req.body;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        error: "Non-Existent User",
      });
    }

    //add user to events users during payment
    let event = await Event.updateOne(
      { _id: eventId },
      {
        $set: { $subtract: ["$availableSpace", spacesBooked] },
      }
    );

    user.bookedEvents.push({
      _id: eventId,
      spaceReserved: spacesBooked
    });

    await user.save();

    res.status(201).json({
      message: "Event successfully booked. Your booking will expire if you don't pay within 24 hours.",
      spacesBooked: spacesBooked,
      ticketPrice: event.tickets.price
    });
  } catch (error) {
    res.status(400).json({
      error: "Error Booking Event, please try again.",
    });
  }
}

exports.bankPayment = async (req, res) => {
  EventFunctions.bankPayment(req, res, req.params.eventId);
}

exports.verifyBankPayment = async (req, res) => {
  EventFunctions.bankPaymentVerification(req, res, req.params.eventId);
}

exports.ussdPayment = async (req, res) => {
  EventFunctions.ussdPayment(req, res, req.params.eventId);
}

exports.verifyUssdPayment = async (req, res) => {
  EventFunctions.ussdPaymentVerification(req, res, req.params.eventId);
}

exports.printTicket = async (req, res) => {

}

exports.viewEvent = async (req, res) => {
  res.setHeader('access-token', req.token);
  const errors = validationResult(req);

  try {
    const id = req.body.id,
      event = await Event.findById(id);

    res.status(200).json({ event: event });
  } catch (error) {
    res.status(400).json({
      error: "Error Fetching Event Details, please try again.",
    });
  }
}

exports.viewBookedEvents = async (req, res) => {
  res.setHeader('access-token', req.token);

  try {
    const user = await User.findById(req.user._id);

    const bookedEvents = user.bookedEvents.populate("bookedEvents", "title location.state dates");

    res.status(200).json({ events: bookedEvents });
  } catch (error) {
    res.status(400).json({
      error: "Error Fetching Events, please try again.",
    });
  }
}


