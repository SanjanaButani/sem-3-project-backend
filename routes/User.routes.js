const router = require('express').Router();

const multer = require('multer');
const userController = require('../controllers/User.controller');
const { verifyAccessToken } = require('../utils/jwt_helper');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/new-user', userController.createUser);

router.post('/login', userController.login);

router.get('/profile', verifyAccessToken, userController.profile);

router.post('/appointment/new', verifyAccessToken, userController.newAppointment);

router.get('/appointment-details', verifyAccessToken, userController.getAppointmentDetails);

router.post('/update', userController.updateUser);

module.exports = router;