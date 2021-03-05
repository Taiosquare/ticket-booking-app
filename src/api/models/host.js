const mongoose = require('mongoose'),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema;

const HostSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },

    brandName: {
      type: String,
      required: true,
      unique: true
    },

    brandType: {
      type: String,
      required: true
    },

    brandDescription: {
      type: String,
      required: true
    },

    brandEmail: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    brandWebsite: {
      type: String,
    },

    brandPhoneNumber: {
      type: String,
      required: true
    },

    brandProfilePicture: {
      type: String,
    },

    address: {
      type: String,
      required: true
    },

    securityQuestion: {
      type: String,
      required: true
    },

    securityAnswer: {
      type: String,
      required: true
    },

    // paymentMethod: {
    //   type: PaymentMethodSchema,
    // },

    verifiedMail: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    accountSuspended: {
      type: Boolean,
      default: false,
    },

    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "event",
      },
    ],

    token: String,

    confirmationToken: String,

    confirmTokenExpiration: Date,

    resetToken: String,

    resetTokenExpiration: Date,

  },
  {
    autoCreate: true,
    strict: false,
    autoIndex: false,
    timestamps: true,
  }
);

const Host = mongoose.model('host', HostSchema);

module.exports = { Host }; 
