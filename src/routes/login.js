//procedimientos para la autenticación y registro de usuarios

const express = require('express');
const router = express.Router();

const passport = require('passport');
// Con isLoggedIn PROTEJO LAS RUTAS
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/signup', isLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

// SINGIN
router.get('/signin', isNotLoggedIn, (req, res) => {
    // con "layout: false" omito la plantilla por defecto
    res.render('auth/signin', { layout: false });
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile', // define a donde se dirige si todo es correcto
        failureRedirect: '/signin',
        failureFlash: true // para enviar mensajes a la vista
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut(); // este método es entregado por passport 
    res.redirect('/signin');
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

module.exports = router;