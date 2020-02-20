const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/bussiness', isLoggedIn, async(req, res) => {
    const bussiness = await pool.query('SELECT * FROM bussiness');
    console.log(bussiness);
    //const bussiness = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('bussiness/list', { bussiness });

});

router.get('/bussiness/add', isLoggedIn, async(req, res) => {
    const users = await pool.query('SELECT * FROM users');
    console.log(users)
    res.render('bussiness/add', { users });
    //res.render('bussiness/add');
});

router.post('/bussiness/add', async(req, res) => {
    const { number_id, username = number_id, name, lastname, telephone, cellphone, address, password, tipo_id = '1', customers_id = '2', tipou_id = '3' } = req.body;
    const newEmployes = {
        number_id,
        name,
        username,
        lastname,
        telephone,
        cellphone,
        address,
        password,
        tipo_id,
        customers_id: req.user.ustomers_id,
        tipou_id
        //user_id: req.user.id
    };
    console.log(newEmployes);
    //await pool.query('INSERT INTO users set ?', [newEmployes]);
    //req.flash('success', 'Empleado guardado exitosamente');
    res.redirect('/employees');
});
module.exports = router;