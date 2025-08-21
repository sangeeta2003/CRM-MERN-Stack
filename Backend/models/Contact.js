const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    status: { type: String, enum: ['Lead', 'Prospect', 'Customer', 'Inactive'], default: 'Lead' },
    notes: { type: String, default: '' },
    lastContacted: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);


