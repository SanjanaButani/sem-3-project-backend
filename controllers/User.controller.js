const createError = require('http-errors');

const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { signAccessToken } = require('../utils/jwt_helper');
const Appointment = require('../models/Appointment.model');

// Create a user
exports.createUser = async (req, res, next) => {
    try {
        const { username, password, email, mobile } = req.body;

        const findUser = await User.findOne({ email });
        if(findUser) throw createError.Conflict('User already exists please login!');
        
        const salt = await bcrypt.genSalt(10);
        const encPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User({
            username, password: encPassword, email, mobile
        });
        newUser.save();

        const accessToken = await signAccessToken(newUser.id);

        newUser && res.status(200).json({
            success: true,
            message: 'New user created!',
            accessToken,
            userType: newUser.type === 'admin' ? 1 : 2,
        });
        
    } catch (err) {
        next(err);
    }
}

// User Login
exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) throw createError.NotFound("User not registered!");

        const isMatch = await user.isValidPassword(req.body.password);
        if (!isMatch) throw createError.Unauthorized("Username/Password not valid!");

        const accessToken = await signAccessToken(user.id);

        res.json({ success: true, accessToken, userType: user.type === 'admin' ? 1 : 2 });

    } catch (err) {
        next(err);
    }
}

// User Profile
exports.profile = async (req, res, next) => {
    try {
        const payload = req.payload;

        const user = await User.findOne({ _id: payload.aud });
        if (!user) throw createError.NotFound("User not registered!");
        
        user && res.status(200).json({
            success: true,
            user
        });
        
    } catch (err) {
        next(err);
    }
}

// Update User
exports.updateUser = async (req, res, next) => {
    try {
        const { email, mobile } = req.body;

        const user = await User.findOne({ email });
        if (!user) throw createError.NotFound("User not registered!");
        
        const updateUser = await User.findOneAndUpdate({ email }, 
            { 
                $set: { mobile } 
            }
        );
        
        updateUser && res.status(200).json({
            success: true,
            message: 'User updated'
        });
        
    } catch (err) {
        next(err);
    }
}

// New user appointment
exports.newAppointment = async (req, res, next) => {
    try {
        const payload = req.payload;
        const { date, services } = req.body;

        const user = await User.findOne({ _id: payload.aud });
        
        const newAppointment = await Appointment({
            createdBy: {
                username: user.username, userId: user._id, mobile: user.mobile
            },
            date,
            services
        });
        newAppointment.save();

        const updateUser = await User.findOneAndUpdate({ _id: payload.aud },
            { $push: { appointments: newAppointment._id } }
        );

        (newAppointment && updateUser) && res.status(200).json({
            success: true,
            message: 'Appointment created!'
        });
        
    } catch (err) {
        next(err);
    }
}

// Get appointment details
exports.getAppointmentDetails = async (req, res, next) => {
    try {
        const payload = req.payload;

        const appointment = await Appointment.find({ 'createdBy.userId': payload.aud }).sort({ createdAt: -1 }).limit(1);
        console.log(appointment);

        appointment && res.status(200).json({
            success: true,
            appointment,
        });
        
    } catch (err) {
        next(err);
    }
}


exports.test = async (req, res, next) => {
    try {
        
    } catch (err) {
        next(err);
    }
}