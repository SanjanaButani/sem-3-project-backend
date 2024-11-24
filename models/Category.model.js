const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: '',
    },
    createdBy: {
        username: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        profilepic: {
            type: String,
            default: '',
        },
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;