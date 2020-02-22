const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');
//lista
router.get('/office', isLoggedIn, async(req, res) => {
    const office = await pool.query('SELECT b.id AS id, b.number_cel AS celular, b.names AS nombres, b.address AS direccion, b.city_id AS idcity, b.responsable AS responsable, b.customer_id AS idcliente, b.active AS active, a.id AS idmun, a.nombre AS nombremun FROM office AS b INNER JOIN municipios AS a ON b.id = a.id ORDER BY b.names ASC;');
    //console.log(office);
    //const office = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('office/list', { office });
    //res.render('office/add', { office });

});
//eliminar
router.get('/office/delete/:id', async(req, res) => {
    const { id } = req.params;
    //console.log(req.params.id);
    //res.send('Deleted');
    await pool.query('DELETE FROM office WHERE ID = ?', [id]);
    req.flash('success', 'El registrado ha sido eliminado exitosamente');
    res.redirect('/office');
});

router.get('/office/add', isLoggedIn, async(req, res) => {
    const office = await pool.query('SELECT * FROM municipios');
    //const office = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('office/add', { office });
    //res.render('office/add');
});


router.post('/office/add', async(req, res, done) => {
    const { number_cel, names, address, city_id, responsable, active = 'S' } = req.body;
    const newOffice = {
        number_cel,
        names,
        address,
        city_id,
        responsable,
        customer_id: req.user.customers_id,
        active
    };
    console.log(newOffice);

    // validar si el usuario existe con nùmero de cedula
    const rows = await pool.query('SELECT * FROM office WHERE names = ?', [names]);

    if (rows.length > 0) {
        done(null, false, req.flash('message', 'Existe una oficina creada con el mismo nombre'));
        res.redirect('/office/add');
    } else {
        //newEmployes.password = await helpers.encryptPassword(password);
        const result = await pool.query('INSERT INTO office SET ? ', newOffice);
        console.log('Entrepor acá');
        newOffice.id = result.insertId;
        req.flash('success', 'Oficina creada exitosamente');
        res.redirect('/office');
    }
});
//editar
router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const users = await pool.query('SELECT b.id AS id, b.number_cel AS celular, b.names AS nombres, b.address AS direccion, b.city_id AS idcity, b.responsable AS responsable, b.customer_id AS idcliente, b.active AS active, a.id AS idmun, a.nombre AS nombremun FROM office AS b INNER JOIN municipios AS a ON b.id = a.id WHERE b.id = ?', [id]);
    const office = await pool.query('SELECT * FROM municipios');
    res.render('office/edit', { user: users[0], office });
});




router.post('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { number_cel, names, address, city_id, responsable, active = 'S' } = req.body;
    const newuser = {
        number_cel,
        names,
        address,
        city_id,
        responsable,
        customer_id: req.user.customers_id,
        active
    };
    console.log(newuser);
    await pool.query('UPDATE office SET ? WHERE id = ?', [newuser, id]);
    req.flash('success', 'Oficina actualizada correctamente');
    res.redirect('/office');
});

module.exports = router;