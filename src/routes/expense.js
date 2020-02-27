const express = require('express');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async(req, res) => {
    const idcliente = req.user.customers_id;
    const expense = await pool.query('SELECT m.id as id, m.description as description, m.estado as estado, tg.description as gasto, tp. description as operacion FROM motivogasto AS m INNER JOIN tipo_gasto AS tg ON tg.id = m.idtipogasto INNER JOIN tipo_operacion AS tp ON tp.id = m.idoperacion where m.customers_id = ?', [idcliente]);
    res.render('expense/list', { expense });
});


router.get('/estado/:id', async(req, res) => {

    const { id } = req.params;
    const gasto = await pool.query('SELECT estado FROM motivogasto WHERE ID = ?', [id]);
    var estado = gasto[0].estado
    if (estado == 'Activo') {
        var newestado = "Inactivo";
    } else {
        var newestado = "Activo";
    }
    console.log(newestado, id);
    await pool.query('UPDATE motivogasto SET estado = ? WHERE id =?', [newestado, id]);
    req.flash('success', 'Estado actualizado correctamente');
    res.redirect('/expense');
});

router.get('/add', isLoggedIn, async(req, res) => {
    const tipo_operacion = await pool.query('SELECT * FROM tipo_operacion');
    const tipo_gasto = await pool.query('SELECT * FROM tipo_gasto');
    res.render('expense/add', { tipo_operacion, tipo_gasto });
});

router.post('/expense/add', async(req, res, done) => {
    const { description, idtipogasto, idoperacion, customers_id } = req.body;

    const expense = {
        description,
        idtipogasto,
        idoperacion,
        customers_id: req.user.customers_id,
    };

    const result = await pool.query('INSERT INTO motivogasto SET ? ', expense);
    expense.id = result.insertId;
    req.flash('success', 'Tipo gasto creado correctamente');
    res.redirect('/expense');
});
module.exports = router;