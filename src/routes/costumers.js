const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');
router.get('/costumers', isLoggedIn, async(req, res) => {
    //res.send('Formulario');
    res.render('costumers/list');
});


module.exports = router;