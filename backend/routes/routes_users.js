const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, changePassword, getMe } = require('../controllers/controller_users');

const { auth } = require ('../middleware/middleware_auth');


router.post('/register', register);
router.post('/login', login);
router.get('/getAll', auth, getAllUsers);
router.put('/change-password', auth, changePassword);
router.get('/me', auth, getMe);

module.exports = router;
