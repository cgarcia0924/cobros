const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');
router.get('/usuarios', isLoggedIn, async(req, res) => {
    const usuarios = await pool.query('SELECT * FROM users');
    res.render('usuarios/lista', { usuarios });
});

module.exports = router;