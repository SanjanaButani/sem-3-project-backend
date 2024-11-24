const createError = require('http-errors');

const User = require('../models/User.model');
const Category = require('../models/Category.model');
const bcrypt = require('bcrypt');
const { signAccessToken, getUserIdFromToken } = require('../utils/jwt_helper');
const Package = require('../models/Package.model');
const Appointment = require('../models/Appointment.model');

// Get category details
exports.getCategoryDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const category = await Category.findOne({ _id: id });

        category && res.status(200).json({
            success: true,
            category
        });
    } catch (err) {
        next(err);
    }
}

// Get all categories
exports.getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();

        categories && res.status(200).json({
            success: true,
            categories
        });
    } catch (err) {
        next(err);
    }
}

// Get all packages
exports.getPackages = async (req, res, next) => {
    try {
        const packages = await Package.find();

        packages && res.status(200).json({
            success: true,
            packages
        });
    } catch (err) {
        next(err);
    }
}

// Create new category
exports.createCategory = async (req, res, next) => {
    try {
        const id = req.payload;
        const uploadedFile = req.file;
        
        const user = await User.findOne({ _id: id.aud });

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const { name } = req.body;

        const findCategory = await Category.findOne({ name });
        if(findCategory) throw createError.Conflict('Category already exist');
        
        const newCategory = await Category({ 
            name,
            createdBy: { username: user.username, userId: user._id },
            image: uploadedFile.path
        });
        newCategory.save();

        newCategory && res.status(200).json({
            success: true,
            message: 'New category created!',
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

// Update Category
exports.updateCategory = async (req, res, next) => {
    try {
        const uploadedFile = req.file;
        const { _id, name } = req.body;
        
        const updateCategory = await Category.findOneAndUpdate({ _id },
            {
                $set: { 
                    name,
                    image: uploadedFile ? uploadedFile.path : ''
                }
            }
        );
        
        updateCategory && res.status(200).json({
            success: true,
            message: 'Category updated!',
        });
    } catch (err) {
        next(err);
    }
}

// Delete Category
exports.deleteCategory = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        const updateCategory = await Category.findOneAndDelete({ _id: categoryId });
        
        updateCategory && res.status(200).json({
            success: true,
            message: 'Category deleted!',
        });
    } catch (err) {
        next(err);
    }
}

// Create new package
exports.createNewPackage = async (req, res, next) => {
    try {
        const uploadedFile = req.file;
        const { name, price, category, items } = req.body;
        
        const findPackage = await Package.findOne({ name, category });
        if(findPackage) throw createError.Conflict('Package already exists!');
        
        const sepItems = items && items.split(',').map(item => item.trim());
        console.log(items);
        console.log(sepItems);

        const newPackage = await Package({
            name,
            price,
            category,
            image: uploadedFile ? uploadedFile.path : '',
            items: sepItems || [],
        });
        newPackage.save();
        
        newPackage && res.status(200).json({
            success: true,
            message: 'New package created!',
        });
    } catch (err) {
        next(err);
    }
}

// Delete package
exports.deletePackage = async (req, res, next) => {
    try {
        const packageId = req.params.id;

        const deletePackage = await Package.findOneAndDelete({ _id: packageId });

        deletePackage && res.status(200).json({
            success: true,
        });
        
    } catch (err) {
        next(err);
    }
}

// Create Bridal Package
exports.createSpecialPackage = async (req, res, next) => {
    try {
        const uploadedFile = req.file;
        const { name, price, category, items } = req.body;

        const findPackage = await Package.findOne({ name, category });
        if(findPackage) throw createError.Conflict('Package already exists!');

        const newPackage = await Package({
            name,
            price,
            items,
            image: uploadedFile ? uploadedFile.path : ''
        });
        newPackage.save();
        
        newPackage && res.status(200).json({
            success: true,
            message: 'New package created!',
        });
    } catch (err) {
        next(err);
    }
}

// Get bridal packages
exports.getBridalPackages = async (req, res, next) => {
    try {
        const getCategory = await Category.findOne({ name: 'bridal' });
        // const bridalPackages = await Package.find({ category });
    } catch (err) {
        next(err);
    }
}

// Get products by category 
exports.getProductsByCategory = async (req, res, next) => {
    try {
        const id = req.params.categoryId;
        const packages = await Package.find({ category: id });

        packages && res.status(200).json({
            success: true,
            packages,
        });
    } catch (err) {
        next(err);
    }
}

// Get All Appointments
exports.getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find({ status: 'waiting' });

        appointments && res.status(200).json({
            success: true,
            appointments
        });
    } catch (err) {
        next(err);
    }
}

// Get Appointments Details
exports.getAppointmentDetails = async (req, res, next) => {
    try {
        const id = req.params.id;
        const appointments = await Appointment.find({ _id: id });

        appointments && res.status(200).json({
            success: true,
            appointment
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