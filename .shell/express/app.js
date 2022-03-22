require('dotenv').config({
    path: __dirname + '/.env'
});
const cors = require('cors');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// session store
// const MySQLStore = require('express-mysql-session')(session)
// const sessionStore = new MySQLStore({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   port: 3306,
//   database: process.env.DB_NAME
// })

const app = express();

// view engine setup
const isProduction = app.get('env') === 'production'
const allowed = []
const corsOptionsAction = async function(req, callback) {
    var options = {
        origin: false
    }
    var canAccess = false
    if (!isProduction) {
        canAccess = true
    } else if (allowed.indexOf(req.header('Origin')) !== -1) {
        canAccess = true
    }
    (() => {
        if (canAccess) {
            options = {
                origin: true
            }
        } else {
            options = {
                origin: false
            }
        }
    });
    callback(null, options)
}
const configSession = {
    secret: 'myappexpress',
    saveUninitialized: false,
    resave: false,
    // store: sessionStore,
    cookie: {
        maxAge: 600000
    }
}
if (isProduction) {
    app.set('trust proxy', 1)
    configSession.cookie.secure = true
}
app.use(session(configSession))
app.use(cors(corsOptionsAction))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;