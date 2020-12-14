const mongoose = require('mongoose'),
  { ObjectId } = require("mongodb"), 
  Schema = mongoose.Schema;
  
const amountSchema = new Schema(
    {
        currency: {
            type: String,
            required: true
        },

        amount: {
            type: String,
            required: true
        }
    }
);

const TicketSchema = new Schema(
  {
    _id: {
      type: ObjectId,
      required: true,
    },
        
    type: {
        type: String,
        required: true,
    },

    transferredFrom: {
        type: Object, 
        set: set.deleteEmpty
    },

    // refNo: {
    //     type: String,
    //     default: Math.round(new Date().getTime() + (Math.random() * 100)).toString()
    // },

    amountPaid: {
        type: amountSchema,
        required: true
    },

    isUsed: {
        type: Boolean,
        default: false
    },

    seatBooked: {
        type: String,
    },

    customer: {
        type: Schema.Types.ObjectId,
        ref: "customer",
    },
    
    event: {
        type: Schema.Types.ObjectId,
        ref: "event",
    } 
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

