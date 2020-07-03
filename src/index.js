const express = require("express");
const path = require("path")
const exphbs = require("express-handlebars");
const methodOverride = require('method-override');
const expressSession = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
//const { type } = require("os");

//Initializaciones
const app = express();
require('./database')
require('./config/passport');
//Settings



app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));


app.set('view engine', '.hbs');

//Middlewars
app.use(express.urlencoded({ extended: false }));
//Si existe valida en peticiones put o delete
app.use(methodOverride('_method'));

app.use(expressSession({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());


//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');


    res.locals.user = req.user || null;

    next();
});


//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Static Files
app.use(express.static(path.join(__dirname, 'public')))



//Server is Listening
app.listen(app.get('port'), () => {
    console.log('Server on Port: ' + app.get('port'));
});