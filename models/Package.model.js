const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    image: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Types.ObjectId,
    },
    items: {
        type: Array,
        default: [],
    }
}, { timestamps: true });

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;