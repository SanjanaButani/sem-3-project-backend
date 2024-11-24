const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    createdBy: {
        username: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        profilepic: {
            type: String,
            default: '',
        },
        mobile: {
            type: String,
            default: '',
        }
    },
    services: {
        type: Array,
        default: [],
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    status: {
        type: String,
        enum: [ 'waiting', 'open', 'closed' ],
        default: 'waiting',
        required: true,
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;