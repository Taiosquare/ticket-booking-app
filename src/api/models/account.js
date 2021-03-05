const mongoose = require("mongoose"),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    transferCode: {
      type: String,
      required: true,
    },

    amount: {
      type: String,
      required: true,
    },

    currency: {
      type: String,
      required: true
    },

    paidAt: {
      type: Date,
      required: true
    },

    bank: {
      type: String,
      required: true
    },

    event: {
      type: Schema.Types.ObjectId,
      ref: "event",
    },
  },
  {
    timestamps: true,
  }
);

const AccountSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },

    accountName: {
      type: String,
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    bank: {
      type: String,
      required: true,
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "host",
    },

    payments: {
      type: [PaymentSchema]
    },

    //recepientCode: String,
  },
  {
    autoCreate: true,
    strict: false,
    autoIndex: false,
    timestamps: true,
  }
);

const Account = mongoose.model("account", AccountSchema);

module.exports = { Account };
