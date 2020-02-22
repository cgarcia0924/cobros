const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const helpers = require('../lib/helpers');

const { isLoggedIn } = require('../lib/auth');

router.get('/users', isLoggedIn, async(req, res) => {
    const usuarios = await pool.query('SELECT u.id AS id, u.name AS name, u.username AS username, u.lastname AS lastname, t.name As tipo_users FROM users AS u INNER JOIN tipo_users AS t ON t.id = u.tipou_id');
    res.render('users/list', { usuarios });
});

router.get('/delete/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?', [id]);
    req.flash('success', 'Usuario eliminado exitosamente');
    res.redirect('/users');
});

router.get('/add', isLoggedIn, async(req, res) => {
    const tipo_users = await pool.query('SELECT * from tipo_users');
    console.log(tipo_users)
    res.render('users/add', { tipo_users });
});


router.post('/users/add', async(req, res, done) => {
    const { number_id, username, name, lastname, telephone, cellphone, address, password, tipo_id = '1', tipou_id } = req.body;
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
        res.redirect('/users/add');
    } else {
        newEmployes.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO users SET ? ', newEmployes);
        newEmployes.id = result.insertId;
        req.flash('success', 'Empleado creado exitosamente');
        res.redirect('/users');
    }
});

router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE ID = ?', [id]);
    res.render('employees/edit', { user: users[0] });
});

router.post('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { number_id, username, name, lastname, telephone, cellphone, address, tipo_id = '1', tipou_id } = req.body;
    const newuser = {
        number_id,
        name,
        username,
        lastname,
        telephone,
        cellphone,
        address,
        tipo_id,
        tipou_id
    };
    console.log(newuser);
    await pool.query('UPDATE users SET ? WHERE id = ?', [newuser, id]);
    req.flash('success', 'Usuario Actualizado Correctamente');
    res.redirect('/employees');
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});


module.exports = router;