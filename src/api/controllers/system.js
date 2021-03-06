require("dotenv").config();

const crypto = require("crypto"),
  GeneralFunctions = require("../functions/generalFunctions"),
  { Event } = require("../models/event"),
  { Account } = require("../models/account"),
  { validationResult } = require("express-validator");

exports.paymentSuccess = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    let hash = crypto.createHmac('sha512', process.env.PAYSTACK_TEST_SECRET)
      .update(JSON.stringify(req.body)).digest('hex');

    if (hash == req.headers['x-paystack-signature']) {
      let event = JSON.parse(req.body);

      console.log(event);

      if (event.event == 'charge.success') {
        await GeneralFunctions.userSavePayment(event);
      } else if (event.event == 'transfer.success') {
        await GeneralFunctions.hostSavePayment(event);
      }

      res.send(200);
    }
  } catch (error) {
    res.status(400).json({
      error: 'Error: An error occurred while the payment details were being saved.',
    });
  }
}

exports.payHost = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: await GeneralFunctions.validationErrorCheck(errors)
      });
    }

    const id = req.params.id,
      eventId = req.body.eventId;

    let recepientCode = "",
      event = await Event.findById(eventId),
      account = await Account.findOne({ host: id });

    if (!account.recepientCode) {
      account.recepientCode = await GeneralFunctions.createRecepientCode(
        account.accountName, account.accountNumber, account.bank
      );

      await account.save();

      recepientCode = account.recepientCode;
    } else {
      recepientCode = account.recepientCode;
    }

    let amount = (event.tickets.totalTickets - event.tickets.availableTickets) * event.tickets.price * 100,

    const params = {
      "source": "balance",
      "reason": "Service Payment",
      "amount": amount,
      "recipient": recepientCode
    }

    let response = await fetch(`https://api.paystack.co/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
    });

    let response2 = await response.json();
    // IO & Email

    event.transferCode = response2.data.transfer_code;

    await event.save();

    if (response2.status == true) {
      res.status(200).json({
        message: 'Payment has successfully been made to the host.',
        transferCode: response2.data.transfer_code
      });
    } else {
      res.status(400).json({
        error: 'Error: The Payment could not be made, please try again.',
      });
    }
  } catch (error) {
    res.status(400).json({
      error: 'Error: An error occurred while trying to make payment, please try again.',
    });
  }
}