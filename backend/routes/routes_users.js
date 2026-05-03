const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/controller_users');
const { auth } = require ('../middleware/middleware_auth');


router.post('/register', register);
router.post('/login', login);

module.exports = router;
