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
});

// Hacks: - Try and populate again without autoIndex turned off, implement function
const EventSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    poster: {
      type: ImageSchema,
      required: true
    },

    type: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
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
  },
  {
    autoCreate: true,
    strict: false,
    autoIndex: false,
    timestamps: true,
  }
);

EventSchema.index(
  {
    title: "text",
    type: "text",
    category: "text",
    "location.state": "text",
    "date.begin": "text",
  },
  {
    weights: {
      title: 5,
      "location.state": 4,
      category: 4,
      type: 3
    },
    name: "TextIndex"
  }
);

const Event = mongoose.model('event', EventSchema);

module.exports = { Event };