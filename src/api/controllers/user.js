require("dotenv").config();

const { Event } = require("../models/event"),
  { User } = require("../models/user"),
  mongoose = require("mongoose"),
  crypto = require("crypto"),
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
  
}

exports.bookEvent = async (req, res) => {
  // Booking should be removed after a period of time if customer doesn't pay
  res.setHeader('access-token', req.token);
  const errors = validationResult(req);
    
  try {
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: await GeneralFunctions.validationErrorCheck(errors)
        });
    } 
      
    const { eventId, userId, spacesBooked } = req.body;
    
    let user = await User.findById(userId);
      
    if (!user) {
        res.status(400).json({
            error: "Non-Existent User",
        });
    } 
      
    //add user to events users during payment
    await Event.updateOne({ _id: eventId },
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
    });
  } catch (error) {
    res.status(400).json({
      error: "Error Booking Event, please try again.",
    });
  }
}

exports.bankPayment = async (req, res) => {
  
}

exports.verifyBankPayment = async (req, res) => {
  
}

exports.ussdPayment = async (req, res) => {
  
}

exports.verifyUssdPayment = async (req, res) => {
  
}

exports.printTicket = async (req, res) => {
  
}

exports.viewEvent = async (req, res) => {
  res.setHeader('access-token', req.token);
  const id = req.body.id;
    
  try {
    const event = await Event.findById(id);

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

exports.paymentSuccess = async (req, res) => {
  //validate event
  var hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET)
    .update(JSON.stringify(req.body)).digest('hex');
  
  if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    var event = JSON.parse(req.body);
    console.log(event); 

    // let response = await fetch(`https://api.paystack.co/transaction/verify/${paystackRefNumber}`, {
    //   method: "GET",
    //   headers: {
    //     authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
    //   },
    // });
    
    // console.log(response);  
  }

  res.send(200);
}
