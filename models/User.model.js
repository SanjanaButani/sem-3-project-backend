const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        default: '',
    },
    profilepic: {
        type: String,
        default: '',
    },
    appointments: {
        type: Array,
        default: [],
    },
    type: {
        type: String,
        enum: [ 'user', 'admin' ],
        default: 'user',
    }
}, { timestamps: true });

userSchema.methods.isValidPassword = async function(password){
    try {
        return await bcrypt.compare(password || '', this.password || '');
    } catch (err) {
        throw err;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;