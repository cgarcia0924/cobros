const express = require('express');
const router = express.Router();

const passport = require('passport');
const pool = require('../database');
const helpers = require('../lib/helpers');

const { isLoggedIn } = require('../lib/auth');

router.get('/users', isLoggedIn, async(req, res) => {
    const customers = req.user.customers_id;
    const usuarios = await pool.query('SELECT u.id AS id, u.number_id AS number_id, u.name AS name, u.customers_id as customers_id, u.username AS username, u.lastname AS lastname, t.name As tipo_users FROM users AS u INNER JOIN tipo_users AS t ON t.id = u.tipou_id WHERE u.customers_id = ?', [customers]);
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
    const office = await pool.query('select * from office join ( select distinct office_id, names as nombres from bussiness ) as a on office.id = a.office_id');
    
    const id_cliente = req.user.customers_id;
    const office1 = await pool.query('SELECT b.id AS id, b.number_cel AS celular, b.names AS nombres, b.address AS direccion, b.city_id AS idcity, b.responsable AS responsable, b.customer_id AS idcliente, b.active AS active, a.id AS idmun, a.nombre AS nombremun FROM office AS b INNER JOIN municipios AS a ON b.id = a.id WHERE b.customer_id= ? ORDER BY b.names ASC;', [id_cliente]);
    //console.log(office);
    //const office = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //res.render('office/list', { office });
    console.log(tipo_users)
    res.render('users/add', { tipo_users, office, office1 });
});


router.post('/users/add', async(req, res, done) => {
    const { number_id, username, name, lastname, telephone, cellphone, address, password, tipo_id = '1', tipou_id } = req.body;
    const newUsers = {
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
        newUsers.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO users SET ? ', newUsers);
        newUsers.id = result.insertId;
        req.flash('success', 'Empleado creado exitosamente');
        res.redirect('/users');
    }
});

router.get('/cobro/:id', async(req, res) => {
    const { id } = req.params;
    const cobro = await pool.query('SELECT * from bussiness WHERE office_id = 2',);
    const office = await pool.query('select * from office join ( select distinct office_id, names as nombres from bussiness ) as a on office.id = a.office_id');
    console.log(cobro);
    res.render('users/add', { cobro, office });
});

router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE ID = ?', [id]);
    const tusers = await pool.query('SELECT t.id as id, t.name as name FROM tipo_users AS t INNER JOIN users AS u ON u.tipou_id  = t.id where  u.id =?', [id]);
    const tipo_users = await pool.query('SELECT * FROM tipo_users');
    console.log(tusers);
    res.render('users/edit', { user: users[0], tipo_users, tusers: tusers[0] });
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
    res.redirect('/users');
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});


module.exports = router;