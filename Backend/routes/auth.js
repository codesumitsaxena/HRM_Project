const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', authController.getAllUsers);
router.get('/users/:id', authController.getUserById);

module.exports = router;