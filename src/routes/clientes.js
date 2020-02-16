const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');
router.get('/consultas', isLoggedIn, async(req, res) => {
    //res.send('Formulario');
    res.render('clientes/consultas');
});


module.exports = router;