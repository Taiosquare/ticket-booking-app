const mongoose = require('mongoose'),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema,
  jwt = require("jsonwebtoken");

// Billing Information
// const PaymentMethodSchema = new Schema({
//   cardName: {
//     type: String,
//     required: true
//   },

//   cardno: {
//     type: String,
//     required: true
//   },

//   cvv: {
//     type: String,
//     required: true
//   },

//   expirymonth: {
//     type: String,
//     required: true
//   },

//   expiryyear: {
//     type: String,
//     required: true
//   },

//   pin: {
//     type: String
//   },

//   country: {
//     type: String,
//     default: "NG"
//   },

//   currency: {
//     type: String,
//     default: "NGN"
//   },

//   txRef: {
//     type: String,
//     default: "MC-7663-YU"
//   },

//   suggested_auth: {
//     type: String,
//     default: "NOAUTH"
//   },
// });

const HostSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },

    brandName: {
      type: String,
      required: true
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
      required: true
    },

    password: {
      type: String,
      required: true
    },

    brandWebsite: {
      type: String,
      required: true
    },

    brandPhoneNumber: {
      type: String,
      required: true
    },

    brandProfilePicture: {
      type: String,
      required: true
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
    
    loggedIn: String,

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

HostSchema.statics.generateAuthToken = function (id) {
  let token = jwt
    .sign(
      {
        _id: id,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: "5m",
      }
    )
    .toString();

  return token;
};

HostSchema.statics.generateRefreshToken = function (id) {
  let refresh = jwt
    .sign(
      {
        _id: id,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    )
    .toString();
  
  return refresh;
};

module.exports = mongoose.model('Host', HostSchema);
