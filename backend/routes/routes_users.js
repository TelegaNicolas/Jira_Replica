const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/controller_users');
const { auth } = require ('../middleware/middleware_auth');


router.post('/register', auth, register);
router.post('/login', auth, login);

module.exports = router;
