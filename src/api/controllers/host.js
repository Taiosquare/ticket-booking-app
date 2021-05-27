const { Event } = require("../models/event"),
  { Host } = require("../models/host"),
  mongoose = require("mongoose"),
  GeneralFunctions = require("../functions/generalFunctions"),
  { validationResult } = require("express-validator");

exports.addEvent = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const {
      title, poster, type, category,
      keywords, description, location, tickets, minAge, dates
    } = req.body;

    let event = await Event.findOne({ title: title, host: req.user._id });

    if (event) {
      return res.status(400).json({
        error: "Event already added",
      });
    }

    let newEvent = new Event({
      _id: mongoose.Types.ObjectId(),
      title: title,
      poster: poster,
      type: type,
      category: category,
      keywords: keywords,
      description: description,
      location: location,
      tickets: tickets,
      minimumAge: minAge,
      dates: dates,
      host: req.user._id
    });

    let host = await Host.findById(req.user._id)

    host.events.push(newEvent._id);

    [newEvent, host] = await Promise.all([newEvent.save(), host.save()]);

    res.status(201).json({
      message: "Event successfully added",
      event: {
        _id: newEvent._id,
        title: newEvent.title,
        category: newEvent.category,
        location: newEvent.location,
        dates: newEvent.dates
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      error: "Event could not be registered, please try again.",
    });
  }
}

exports.editEvent = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req),
      id = req.params.eventId;

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    let event = await Event.findById(id);

    req.body.title && (event.title = req.body.title);
    req.body.poster && (event.poster = req.body.poster);
    req.body.public && (event.isPublic = req.body.public);
    req.body.virtual && (event.isVirtual = req.body.virtual);
    req.body.category && (event.category = req.body.category);
    req.body.keywords && (event.keywords = req.body.keywords);
    req.body.description && (event.description = req.body.description);
    req.body.location && (event.location = req.body.location);
    req.body.tickets && (event.tickets = req.body.tickets);
    req.body.minAge && (event.minimumAgeGroup = req.body.minAge);
    req.body.dates && (event.dates = req.body.dates);

    const result = await event.save();

    res.status(200).json({
      message: "Event Details Updated Successfully",
      event: {
        _id: result._id,
        title: result.title,
        category: result.category,
        location: result.location,
        dates: result.dates
      },
    });
  } catch (error) {
    res.status(400).json({
      error: "Event Details Failed to Update, please try again.",
    });
  }
}

exports.deleteEvent = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const errors = validationResult(req),
      id = req.params.eventId;

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    let event = await Event.findById(id);

    if (event.host != req.user._id) {
      return res.status(400).json({
        error: "This User cannot delete this event",
      });
    }

    let host = await Host.findById(req.user._id);

    host.vehicles.pull(vehicleId);

    await host.save();

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({ error: "Event Failed to Delete" });
  }
}

exports.verifyTicketPayment = async (req, res) => {

}

exports.viewRegisteredUsers = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const id = req.params.eventId,
      errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const users = await Event.findById(id)
      .select('users').populate('users.id', 'username firstname lastname email');

    res.status(200).json({ registeredUsers: users });

  } catch (error) {
    res.status(400).json({
      error: "Error Fetching User's Events, please try again.",
    });
  }
}

exports.viewEvent = async (req, res) => {
  try {
    res.setHeader('access-token', req.token);
    const id = req.params.eventId,
      errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const event = await Event.findById(id);

    res.status(200).json({ event: event });
  } catch (error) {
    res.status(400).json({
      error: "Error Fetching Event Details, please try again.",
    });
  }
}

exports.viewEvents = async (req, res) => {
  res.setHeader('access-token', req.token);

  try {
    const events = await Event.find({ "host": req.user._id });

    res.status(200).json({ events: events });
  } catch (error) {
    res.status(400).json({
      error: "Error Fetching User's Events, please try again.",
    });
  }
}