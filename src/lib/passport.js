const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async(req, username, password, done) => {
    const rows = await pool.query('SELECT u.id AS id, u.username AS username, u.password AS password,u.name AS name, u.lastname AS lastname, t.name AS tipo_user,c.active AS estado FROM users AS u INNER JOIN customers AS c ON c.id = u.customers_id INNER JOIN tipo_users AS t ON t.id = u.tipou_id WHERE  c.active = 1 AND u.username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0]; // guardo el usuario que he encontrado
        console.log(user)
        const validPassword = await helpers.matchPassword(password, user.password)
            // genera un falso o verdadero
            //(matchPassword) me compara las contraseñas
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido! ' + user.username + ' Nombre y Apellido ' + user.name + ' ' + user.lastname + ' rol: ' + user.tipo_user));
        } else {
            done(null, false, req.flash('message', 'Clave Incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe.'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {

    const { name } = req.body;
    let newUser = {
        lastname,
        username,
        //tipo_users,
        name,
        password
    };
    newUser.password = await helpers.encryptPassword(password);
    // Saving in the Database
    const result = await pool.query('INSERT INTO users SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});