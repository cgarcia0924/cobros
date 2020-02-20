const express = require('express');
const router = express.Router();

const pool = require('../database');

const { isLoggedIn } = require('../lib/auth');

router.get('/office', isLoggedIn, async(req, res) => {
    const office = await pool.query('SELECT * FROM office');
    console.log(office);
    //const office = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('office/list', { office });

});

router.get('/office/delete/:id', async(req, res) => {
    const { id } = req.params;
    //console.log(req.params.id);
    //res.send('Deleted');
    await pool.query('DELETE FROM office WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/office');
});

router.get('/office/add', isLoggedIn, async(req, res) => {
    // const office = await pool.query('SELECT * FROM office');
    //const office = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //res.render('office/list', { office });
    res.render('office/add');
});

router.get('/office/edit', isLoggedIn, async(req, res) => {
    // const office = await pool.query('SELECT * FROM office');
    //const office = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    //res.render('office/list', { office });
    res.render('office/edit');
});
module.exports = router;