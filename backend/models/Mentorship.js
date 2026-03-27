const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema(
{
student: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
mentor: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
message: { type: String, default: '' },
status: {
type: String,
enum: ['pending', 'active', 'rejected', 'completed'],
default: 'pending'
},
goals: { type: String, default: '' },
},
{ timestamps: true }
);

module.exports = mongoose.model('Mentorship', mentorshipSchema);
