const mongoose = require('mongoose'),
  { ObjectId } = require("mongodb"),
  Schema = mongoose.Schema;

const ImageSchema = new Schema({
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

const LocationSchema = new Schema({
  state: {
    type: String,
    required: true,
    index: "text"
  },

  localGovernment: {
    type: String,
    required: true,
  },

  town: {
    type: String,
    required: true,
    index: "text"
  },

  address: {
    type: String,
    required: true,
  },
});

const DateSchema = new Schema({
  begin: {
    type: Date,
    required: true
  },

  end: {
    type: Date,
    required: true
  },

  days: {
    type: Number
  },

  //   times: {
  //     type: Array
  //   }
});

const DateRangeSchema = new Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  }
});

const TicketsSchema = new Schema({
  // type: {
  //   type: String,
  //   required: true,
  // },

  datesAvailable: {
    type: DateRangeSchema,
    required: true,
  },

  totalTickets: {
    type: Number,
    required: true
  },

  availableTickets: {
    type: Number,
    required: true
  },

  price: {
    type: Number,
    required: true,
  },

  // additionalInfo: {
  //   type: String,
  // },

  // items: {
  //   type: [String]
  // }
});

// const PerksSchema = new Schema({
//   reward: {
//     type: String,
//     required: true
//   },
//   condition: {
//     type: String,
//     required: true
//   },
//   discount: {
//     type: Number,
//     default: 0
//   },
//   note: {
//     type: String,
//     set: set.deleteEmpty
//   }
// });

const EventSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
      index: "text"
    },

    poster: {
      type: ImageSchema,
      required: true
    },

    type: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true,
      index: "text"
    },

    keywords: {
      type: [String]
    },

    description: {
      type: String,
      required: true
    },

    location: {
      type: LocationSchema,
    },

    tickets: {
      type: TicketsSchema,
      required: true
    },

    minimumAge: {
      type: Number,
    },

    availableSpace: {
      type: Number,
      required: true
    },

    dates: {
      type: DateSchema,
    },

    rating: {
      averageScore: {
        type: Number
      },

      numOfRatings: {
        type: Number
      }
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "host",
    },

    users: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },

        numOfTickets: {
          type: Number,
        }
      }
    ],

    transferCode: String,
  },
  {
    autoCreate: true,
    strict: false,
    autoIndex: false,
    timestamps: true,
  }
);

const Event = mongoose.model('event', EventSchema);

module.exports = { Event };