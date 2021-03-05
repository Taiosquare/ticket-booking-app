require("dotenv").config();

const { Event } = require("../models/event"),
    { Ticket } = require("../models/ticket"),
    crypto = require("crypto"),
    mongoose = require("mongoose"),
    fetch = require("node-fetch");

const generateTickets = async (event, numOfTickets) => {
    let tickets = [];

    for (let i = 0; i < numOfTickets; i++) {
        let ticket = new Ticket({
            _id: mongoose.Types.ObjectId(),
            ticketNo: await crypto.randomBytes(8),
            event: {
                _id: event._id,
                title: event.title,
                type: event.type,
                category: event.category,
                dates: event.dates
            },
            price: event.tickets.price,
            paymentStatus: "Initiated"
        })

        await ticket.save();

        tickets.push(ticket);
    }
}

const bankPayment = async (req, res, eventId) => {
    const { email, bank, birthday, numOfTickets } = req.body;

    let event = await Event.findById(eventId);

    const params = {
        email: email,
        amount: event.tickets.price * numOfTickets,
        bank: bank,
        birthday: birthday
    };

    let response = await fetch(`https://api.paystack.co/charge`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params),
    });

    let response2 = await response.json();

    if (response2.status == true) {
        res.status(200).json({
            message: 'Tickets Payment have successfully been initiated, awaiting verification from user',
            reference: response2.data.reference
        });
    } else {
        res.status(400).json({
            error: 'Error: The Payment could not be initiated, please try again.',
        });
    }
}

const bankPaymentVerification = async (req, res, eventId) => {
    // Assign payment reference & status to the tickets here
}

module.exports.bankPayment = bankPayment;
module.exports.bankPaymentVerification = bankPaymentVerification;