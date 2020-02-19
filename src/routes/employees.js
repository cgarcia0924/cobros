const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/employees', isLoggedIn, async(req, res) => {
    // const employees = await pool.query('SELECT * FROM employees');
    //const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //res.render('employees/list', { employees });
    res.render('employees/list');
});

router.get('/employees/add', isLoggedIn, async(req, res) => {
    // const employees = await pool.query('SELECT * FROM employees');
    //const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //res.render('employees/list', { employees });
    res.render('employees/add');
});

router.get('/employees/edit', isLoggedIn, async(req, res) => {
    // const employees = await pool.query('SELECT * FROM employees');
    //const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //res.render('employees/list', { employees });
    res.render('employees/edit');
});
module.exports

module.exports = router;