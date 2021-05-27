const mongoose = require("mongoose"),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema;

const BookedEventsSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      ref: "event",
    },

    spacesReserved: {
      type: Number,
      required: true,
    }
  }
)

const PaymentSchema = new Schema(
  {
    reference: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
    },

    paidAt: {
      type: Date,
      required: true
    },

    bank: {
      type: String,
      required: true
    },

    tickets: [
      {
        type: Schema.Types.ObjectId,
        ref: "ticket",
      }
    ],
  },
  {
    timestamps: true,
  }
);

const UserSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },

    username: {
      type: String,
      //required: true,
    },

    firstname: {
      type: String,
      required: true,
    },

    lastname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    // profileId: {
    //   type: String,
    //   //required: true,
    // },

    verifiedMail: {
      type: Boolean,
      default: false,
    },

    accountSuspended: {
      type: Boolean,
      default: false,
    },

    bookedEvents: {
      type: [BookedEventsSchema]
    },

    payments: {
      type: [PaymentSchema]
    },

    ratedEvents: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "event",
        },

        rating: {
          type: Number,
        }
      }
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

const User = mongoose.model("user", UserSchema);

module.exports = { User };
