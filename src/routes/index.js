const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../lib/auth');

router.get('/index', isLoggedIn, async(req, res) => {
    res.render('index/index');
});

router.get('/', isLoggedIn, async(req, res) => {
    res.render('index/index');
});

module.exports = router;