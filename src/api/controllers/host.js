const { Event } = require("../models/event"),
  { Host } = require("../models/host"),
  { User } = require("../models/user"),
  mongoose = require("mongoose"),
  GeneralFunctions = require("../functions/generalFunctions"),
  { validationResult } = require("express-validator");

exports.addEvent = async (req, res) => {
  res.setHeader('access-token', req.token);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: await GeneralFunctions.validationErrorCheck(errors)
        });
    } 
      
    const {
        title, poster, public, virtual, category,
        keywords, description, location, tickets, minAge, dates 
    } = req.body;
      
    let event = await Event.findOne({ title: title, host: req.host._id });

    if (event) {
        res.status(400).json({
            error: "Event already added",
        });
    } 
      
    const savedObject = await Event.insertOne({
        _id: mongoose.Types.ObjectId(),
        title: title,
        poster: poster,
        isPublic: public,
        isVirtual: virtual,
        category: category,
        keywords: keywords,
        description: description,
        location: location,
        tickets: tickets,
        minimumAgeGroup: minAge,
        dates: dates 
    });

    await Host.findById(req.host._id).events.push(savedObject._id).save();

    res.status(201).json({
        message: "Event successfully added",
        event: {
            _id: savedObject._id,
            title: savedObject.title,
            category: savedObject.category,
            location: savedObject.location,
            dates: savedObject.dates
        },
    });
  } catch (error) {
    res.status(400).json({
      error: "Vehicle could not be registered, please try again.",
    });
  }
}

exports.editEvent = async (req, res) => {

}

exports.deleteEvent = async (req, res) => {

}

exports.viewEvent = async (req, res) => {

}

exports.viewEvents = async (req, res) => {

}