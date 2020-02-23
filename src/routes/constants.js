const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const helpers = require('../lib/helpers');

const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async(req, res) => {
    //res.send('Formulario');
    res.render('constants/list');
});

router.get('/add', isLoggedIn, async(req, res) => {
    //const users = await pool.query('SELECT u.id AS id, u.name AS name, u.lastname AS lastname FROM users AS u ');
    //const office = await pool.query('SELECT * FROM office');
    res.render('constants/add');
});

module.exports = router;