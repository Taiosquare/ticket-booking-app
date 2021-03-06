require("dotenv").config();

const { Event } = require("../models/event"),
  { User } = require("../models/user"),
  GeneralFunctions = require("../functions/generalFunctions"),
  EventFunctions = require("../functions/eventFunctions"),
  { validationResult } = require("express-validator");

exports.searchEvents = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const keyword = req.body.keyword || "";

    // const events = await Event.find(
    //   { $text: { $search: keyword } },
    //   { score: { $meta: "textScore" } }
    // )
    //   .sort({ score: { $meta: "textScore" } }) 
    //   .select("title category location dates");

    const events = await Event.find(
      { $text: { $search: keyword } },
    )
      .select("title category location dates");

    //events == null ? events = :

    console.log(events);

    res.status(200).json({
      events: events
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: "error Fetching Events",
    });
  }
}

exports.rateEvent = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const id = req.params.eventId,
      rating = req.body.rating;

    // Check if User has rated the event before

    await User.updateOne(
      { _id: req.user._id },
      {
        $push: {
          ratedEvents: {
            id: id,
            rating: rating
          }
        }
      },
    );

    let event = await Event.findById(id);

    event.rating.numOfRatings++;

    event.rating.ratings.push(rating);

    const totalRatingsSum = event.rating.ratings.reduce(function (a, b) {
      return a + b;
    }, 0);

    event.rating.averageScore = (totalRatingsSum) / event.rating.numOfRatings;

    await event.save();

    res.status(200).json({
      message: 'Event successfully rated',
      rating: rating,
      event: {
        title: event.title,
        averageRating: Math.round((event.rating.averageScore + Number.EPSILON) * 100) / 100,
        totalRatings: event.rating.numOfRatings
      }
    });
  } catch (error) {
    res.status(400).json({
      error: "Error Rating Event, please try again.",
    });
  }
}

exports.eventBankPayment = async (req, res) => {
  EventFunctions.bankPayment(req, res, req.params.eventId);
}

exports.eventBankPaymentVerification = async (req, res) => {
  EventFunctions.bankPaymentVerification(req, res, req.params.eventId);
}

exports.saveEventDetails = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const { spacesBooked } = req.body;
    const eventId = req.params.eventId;
    const userId = req.user._id;

    await Event.updateOne(
      { _id: eventId },
      {
        $inc: { availableSpace: -Math.abs(spacesBooked) }
      }
    );

    await User.updateOne(
      { _id: userId },
      {
        $push: {
          bookedEvents: {
            _id: eventId,
            spacesReserved: spacesBooked
          }
        }
      }
    );

    res.status(201).json({
      message: "Event successfully booked. Please check your email address for your ticket(s).",
      spacesBooked: spacesBooked,
    });
  } catch (error) {
    res.status(400).json({
      error: "Error Booking Event, please try again.",
    });
  }
}

exports.eventUSSDPayment = async (req, res) => {
  EventFunctions.ussdPayment(req, res, req.params.eventId);
}

exports.eventUSSDPaymentVerification = async (req, res) => {
  EventFunctions.ussdPaymentVerification(req, res, req.params.eventId);
}

exports.viewEvent = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const event = await Event.aggregate([
      { $match: { '_id': req.params.id } },
      {
        $project: {
          title: 1,
          poster: 1,
          location: {
            address: 1,
          },
          rating: {
            averageScore: 1
          },
          category: 1,
          description: 1,
          tickets: 1,
          minimumAge: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    res.status(200).json({ event: event });
  } catch (error) {
    res.status(400).json({
      error: "Error Fetching Event Details, please try again.",
    });
  }
}

exports.viewBookedEvents = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const user = await User.findById(req.user._id);

    const bookedEvents = user.bookedEvents.populate("bookedEvents", "title location.state dates");

    res.status(200).json({ events: bookedEvents });
  } catch (error) {
    res.status(400).json({
      error: "Error Fetching Events, please try again.",
    });
  }
}


