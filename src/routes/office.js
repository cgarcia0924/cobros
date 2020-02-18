const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');
router.get('/office', isLoggedIn, async(req, res) => {
    const office = await pool.query('SELECT * FROM office');
    //const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('office/list', { office });
});

module.exports = router;