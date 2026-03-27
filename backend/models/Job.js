const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
{
postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
title: { type: String, required: true },
company: { type: String, required: true },
location: { type: String, required: true },
type: {
type: String,
enum: ['full-time', 'internship', 'part-time', 'contract'],
default: 'full-time'
},
description: { type: String, required: true },
requirements: { type: String, default: '' },
applyLink: { type: String, default: '' },
salary: { type: String, default: '' },
deadline: { type: Date },
},
{ timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
