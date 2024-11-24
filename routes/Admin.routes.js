const router = require('express').Router();

const multer = require('multer');
const adminController = require('../controllers/Admin.controller');
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

router.get('/category/all', adminController.getCategories);

router.post('/category/new', verifyAccessToken, upload.single('file'), adminController.createCategory);

router.post('/category/update', upload.single('file'), adminController.updateCategory);

router.delete('/category/delete/:id', adminController.deleteCategory);

router.get('/category/:id', adminController.getCategoryDetails);

router.get('/package/all', adminController.getPackages);

router.post('/package/new', upload.single('file'), adminController.createNewPackage);

router.delete('/package/delete/:id', adminController.deletePackage);

router.post('/special-package/new', upload.single('file'), adminController.createSpecialPackage);

router.get('/special-package/bridal', adminController.getBridalPackages);

router.get('/package/:categoryId', adminController.getProductsByCategory);

router.get('/appointments/all', adminController.getAllAppointments);

router.get('/appointments/:id', adminController.getAppointmentDetails);

module.exports = router;