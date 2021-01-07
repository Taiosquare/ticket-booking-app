const { Event } = require("../models/event"),
  { User } = require("../models/user"),
  mongoose = require("mongoose"),
  GeneralFunctions = require("../functions/generalFunctions"),
  { validationResult } = require("express-validator");

exports.searchEvents = async (req, res) => {
    res.setHeader('access-token', req.token);
    const keyword = req.body.keyword || "";
    // Search Criterias: title, category, isVirtual, isPublic, location, dates
    
    try {
        const events = await Event.find(
            { $text: { $search: keyword } },
            { score: { $meta: "textScore" } }
        )
            .sort({ score: { $meta: "textScore" } })

        //events == null ? events = :
        res.status(200).json({
            events: {
                _id: events._id,
                title: events.title,
                category: events.category,
                location: events.location,
                dates: events.dates
            },
        });
    } catch (error) {
        res.status(400).json({
            error: "error Fetching Events",
        });
    }
}

exports.rateEvent = async (req, res) => {
  
}

exports.bookEvent = async (req, res) => {
  
}

exports.purchaseTicket = async (req, res) => {
  
}

exports.printTicket = async (req, res) => {
  
}

exports.viewEvent = async (req, res) => {
  
}

exports.viewRegisteredEvents = async (req, res) => {

}