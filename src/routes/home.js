const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/home', isLoggedIn, async(req, res) => {
    res.render('home/dashboard');
});


module.exports = router;