const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const helpers = require('../lib/helpers');

const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/employees', isLoggedIn, async(req, res) => {
    const users = await pool.query('SELECT * FROM users WHERE tipou_id = 3');
    res.render('employees/list', { users });
});

router.get('/employees/add', isLoggedIn, async(req, res) => {
    res.render('employees/add');
});

router.post('/employees/add', async(req, res, done) => {
    const { number_id, username = number_id, name, lastname, telephone, cellphone, address, password, tipo_id = '1', tipou_id = '3' } = req.body;
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
        customers_id: req.user.customers_id,
        tipou_id
    };
    // validar si el usuario existe con nùmero de cedula
    const rows = await pool.query('SELECT * FROM users WHERE number_id = ?', [number_id]);

    if (rows.length > 0) {
        done(null, false, req.flash('message', 'El número de cédula ingresada ya existe'));
        res.redirect('/employees/add');
    } else {
        newEmployes.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO users SET ? ', newEmployes);
        newEmployes.id = result.insertId;
        req.flash('success', 'Empleado creado exitosamente');
        res.redirect('/employees/');
    }
});



router.get('/employees/edit/:id', async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log(users);
    res.render('/employees/edit/', { link: users[0] });
});

router.post('/employees/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { number_id, username, name, lastname, telephone, cellphone, address, password, tipo_id = '1', tipou_id = '3' } = req.body;
    const newuser = {
        number_id,
        name,
        username,
        lastname,
        telephone,
        cellphone,
        address,
        password,
        tipo_id,
        customers_id: req.user.customers_id,
        tipou_id
    };
    await pool.query('UPDATE users SET ? WHERE id = ?', [newuser, id]);
    req.flash('success', 'Usuario Actualizado Correctamente');
    res.redirect('/employees');
});



passport.serializeUser((user, done) => {
    done(null, user.id);
});


module.exports = router;