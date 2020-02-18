const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');
router.get('/users', isLoggedIn, async(req, res) => {
    const usuarios = await pool.query('SELECT * FROM users');
    res.render('users/list', { usuarios });
});

module.exports = router;