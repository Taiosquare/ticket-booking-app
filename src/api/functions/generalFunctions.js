require("dotenv").config();

const { User } = require("../models/user"),
  { Account } = require("../models/account"),
  { Event } = require("../models/event"),
  { Ticket } = require("../models/ticket");

const environmentCheck = async (env) => {
  let address = "";

  env === "production"
    ? (address = "")
    : (address = `http://localhost:${process.env.PORT}`);

  return address;
};

const validationErrorCheck = async (errors) => {
  let errs = [];

  errors.errors.map((err) => {
    errs.push(err.msg);
  });

  return errs;
}

const hostSavePayment = async (event) => {
  let event = await Event.find({ transferCode: event.data.transfer_code });

  let account = await Account.findOne({ host: event.host }),
    payment = {};

  payment.reference = event.data.reference;
  payment.amount = event.data.amount / 100;
  payment.currency = event.data.currency;
  payment.paidAt = event.data.paid_at;
  payment.bank = event.data.authorization.bank;
  payment.event = event._id;

  account.payments.push(payment);

  await account.save();
}

const userSavePayment = async (event) => {
  let tickets = await Ticket.find({ paymentReference: event.data.reference });

  let ticketIds = tickets.map(ticket => {
    return ticket._id;
  });

  let user = await User.findById(tickets[0].user),
    payment = {};

  payment.reference = event.data.reference;
  payment.amount = event.data.amount / 100;
  payment.currency = event.data.currency;
  payment.paidAt = event.data.paid_at;
  payment.bank = event.data.authorization.bank;
  payment.tickets = ticketIds;

  user.payments.push(payment);

  await user.save();
}

const createRecepientCode = async (name, accountNumber, bankName) => {
  let banks = await fetch('https://api.paystack.co/bank', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
    },
  });

  let banks2 = await banks.json(), code = "";

  for (bank of banks2.data) {
    if (bankName == bank.name) {
      code = bank.code;
      break;
    }
  }

  const params = {
    type: "nuban",
    name: name,
    description: `${name}'s recepient code creation`,
    account_number: accountNumber,
    bank_code: code,
    currency: "NGN"
  }

  let response = await fetch(`https://api.paystack.co/transferrecipient`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PAYSTACK_TEST_SECRET}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params),
  });

  let response2 = await response.json();

  return response2.data.recipient_code;
}

module.exports.environmentCheck = environmentCheck;
module.exports.validationErrorCheck = validationErrorCheck;
module.exports.hostSavePayment = hostSavePayment;
module.exports.userSavePayment = userSavePayment;
module.exports.createRecepientCode = createRecepientCode;
