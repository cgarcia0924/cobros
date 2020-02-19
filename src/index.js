const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const passport = require('passport');
const MySQLStore = require('express-mysql-session');
const session = require('express-session');
const validator = require('express-validator');
const bodyParser = require('body-parser');


const { database } = require('./keys');

// Intializations
const app = express();
require('./lib/passport');

// settings

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));


app.set('view engine', '.hbs');

//Middlewars
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'faztmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//app.use(validator());

//Global Variables

app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});

//Routes: aqui importo las rutas
app.use(require('./routes'));
app.use(require('./routes/login'));
app.use(require('./routes/costumers'));
app.use(require('./routes/users'));
app.use(require('./routes/office'));
app.use(require('./routes/employees'));
app.use(require('./routes/home'));
//app.use('/clientes', require('./routes/clientes'));

//Public
app.use(express.static(path.join(__dirname, 'public')));


//Starting server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'))
});