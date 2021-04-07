const mongoose = require('mongoose'),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema;

const Image = new Schema({
  normal: {
    type: String,
    required: true,
  },

  large: {
    type: String,
    required: true,
  },

  medium: {
    type: String,
    required: true,
  },

  small: {
    type: String,
    required: true,
  },
});

// Admin Fields might be required
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

    email: {
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
      type: Image,
    },

    address: {
      type: String,
      required: true
    },

    // securityQuestion: {
    //   type: String,
    //   required: true
    // },

    // securityAnswer: {
    //   type: String,
    //   required: true
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
