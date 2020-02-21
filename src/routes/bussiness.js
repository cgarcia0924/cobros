const express = require('express');
const router = express.Router();
const date = require('date-and-time');

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async(req, res) => {
    const bussiness = await pool.query('SELECT b.id AS id, b.names AS bnames, o.names AS office, u.name AS name, u.lastname AS lastname, b.date_admission AS date, b.active AS active FROM bussiness AS b INNER JOIN users AS u ON u.id = b.user_id INNER JOIN office as o ON o.id = b.office_id');
    res.render('bussiness/list', { bussiness });
});

router.get('/add', isLoggedIn, async(req, res) => {
    const users = await pool.query('SELECT u.id AS id, u.name AS name, u.lastname AS lastname FROM users AS u ');
    const office = await pool.query('SELECT * FROM office');
    res.render('bussiness/add', { users, office });
});

router.get('/delete/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM bussiness WHERE ID = ?', [id]);
    req.flash('success', 'Negocio Eliminado Exitosamente');
    res.redirect('/bussiness');
});

router.post('/bussiness/add', async(req, res, done) => {
    console.log(req.body)
    const { names, users_id, office_id, active = '1' } = req.body;
    const newBussiness = {
        names,
        office_id: office_id,
        user_id: users_id,
        customers_id: req.user.customers_id,
        active,
    };
    console.log(newBussiness);
    const result = await pool.query('INSERT INTO bussiness set ?', [newBussiness]);
    newBussiness.id = result.insertId;
    req.flash('success', 'Negocio Creado Exitosamente!');
    res.redirect('/bussiness');

});

router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT b.user_id AS user_id, u.name AS name, u.lastname AS lastname FROM bussiness AS b INNER JOIN users AS u ON u.id = b.user_id INNER JOIN office as o ON o.id = b.office_id WHERE b.id = ?', [id]);
    const office = await pool.query('SELECT b.id, b.names AS bnames, o.names AS names, b.office_id AS id  FROM bussiness AS b INNER JOIN users AS u ON u.id = b.user_id INNER JOIN office as o ON o.id = b.office_id WHERE b.id = ?', [id]);
    //console.log(office);
    console.log(users);
    res.render('bussiness/edit', { users: users[0], office: office[0] });
});

router.post('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { number_id, username, name, lastname, telephone, cellphone, address, tipo_id = '1', tipou_id = '3' } = req.body;
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




module.exports = router;