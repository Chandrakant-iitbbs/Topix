const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    answer:{
        type: Schema.Types.ObjectId,
        ref: 'answer',
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    amount:{
        type: Number,
        required: true,
    },
    date:{
        type: Date,
        default: Date.now
    }

});

const Payment = mongoose.model('payment', PaymentSchema);
module.exports = Payment;