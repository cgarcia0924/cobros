const express = require('express');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async(req, res) => {
    const customers = req.user.customers_id;
    const constants = await pool.query('SELECT c.id as id, c.customers_id as customers_id, c.name as name, c.utility as utility, c.term as term, c.nailday as nailday, o.id as office_id, o.names as names   FROM constants AS c INNER JOIN office AS o ON o.id = c.office_id WHERE c.customers_id = ?', [customers]);
    res.render('constants/list', { constants });
});

router.get('/delete/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM constants WHERE ID = ?', [id]);
    req.flash('success', 'Constante eliminada exitosamente');
    res.redirect('/constants');
});

router.get('/add', isLoggedIn, async(req, res) => {
    const office = await pool.query('SELECT * FROM office');
    res.render('constants/add', { office });
});


router.post('/constants/add', async(req, res, done) => {
    console.log(req.body)
    const { name, utility, term, nailday, office_id, customers_id } = req.body;
    const newconstants = {
        name,
        utility,
        term,
        nailday,
        office_id,
        customers_id: req.user.customers_id
    };
    console.log(newconstants);
    const result = await pool.query('INSERT INTO constants set ?', [newconstants]);
    newconstants.id = result.insertId;
    req.flash('success', 'Constante creada exitosamente!');
    res.redirect('/constants');

});


router.get('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const constants = await pool.query('SELECT c.id as id, c.name as name, c.utility as utility, c.term as term, c.nailday as nailday, o.id as office_id, o.names as names   FROM constants AS c INNER JOIN office AS o ON o.id = c.office_id WHERE c.id =?', [id]);
    const office = await pool.query('SELECT * FROM office');
    console.log(constants);
    res.render('constants/edit', { constants: constants[0], office });
});

router.post('/edit/:id', async(req, res) => {
    const { id } = req.params;
    const { name, utility, term, nailday, office_id, customers_id } = req.body;
    const newconstants = {
        name,
        utility,
        term,
        nailday,
        office_id,
        customers_id: req.user.customers_id
    };
    console.log(newconstants);
    await pool.query('UPDATE constants SET ? WHERE id = ?', [newconstants, id]);
    req.flash('success', 'Constante modificada correctamente');
    res.redirect('/constants');
});


module.exports = router;