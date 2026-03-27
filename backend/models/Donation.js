const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
{
donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
amount: { type: Number, required: true },
cause: { type: String, default: 'General Fund' },
razorpayOrderId: String,
razorpayPaymentId: String,
status: {
type: String,
enum: ['pending', 'success', 'failed'],
default: 'pending'
},
message: { type: String, default: '' },
},
{ timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
