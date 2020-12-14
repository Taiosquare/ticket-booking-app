const mongoose = require('mongoose'),
  { ObjectId } = require("mongodb"), 
  Schema = mongoose.Schema;

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
    type: [Number]
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
    type: {
        type: String,
        required: true,
    },

    datesAvailable: {
        type: DateRangeSchema,
        required: true,
    },
  
    availableTickets: {
        type: String,
        required: true
    },

    price: {
        type: String,
        required: true,
    }, 

    additionalInfo: {
        type: String,
    },

    items: {
        type: [String]
    }
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
        required: true
    },
      
    poster: {
        type: String,
        required: true
    },
        
    isPublic: {
        type: Boolean, 
        default: false
    },
        
    isVirtual: {
        type: Boolean, 
        default: false
    },

    category: {
        type: String,
        required: true
    },

    keywords: {
        type: [String]
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },
    
    tickets: {
        type: [TicketsSchema],
        required: true
    },

    minimumAgeGroup: {
        type: Number,
    },

    maximumAgeGroup: {
        type: Number,
        set: set.deleteEmpty
    },

    transferrable: {
        type: Boolean,
        default: true
    },

    refundable: {
        type: Boolean,
        default: true
    },

    dates: {
        type: [DateSchema],
    },

    refundPolicies: {
        type: [String],
    },

    // views: {
    //     type: Array,
    //     default: []
    // },

    host: {
        type: Schema.Types.ObjectId,
        ref: "host",
    },
    
    users: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
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
