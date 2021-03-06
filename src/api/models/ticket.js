const mongoose = require('mongoose'),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema;

const TicketSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },

    ticketNo: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },

    // isUsed: {
    //   type: Boolean,
    //   default: false
    // },

    event: {
      type: Object,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    paymentStatus: {
      type: String,
      required: true
    },

    paymentReference: String,
  },
  {
    autoCreate: true,
    strict: false,
    autoIndex: false,
    timestamps: true,
  }
);

const Ticket = mongoose.model('ticket', TicketSchema);

module.exports = { Ticket };

