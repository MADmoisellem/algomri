require("dotenv").config();
require("./helpers/hbs"); // utils for hbs templates
require("./config/mongodb"); // database initial setup
var createError = require('http-errors');
var express = require('express');
server = express()
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const hbs = require("hbs");
const flash = require("connect-flash");
const dev_mode = process.env.NODE_ENV === 'production' ? false : true;

var app = express();

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

// SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 }, // in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    saveUninitialized: true,
    resave: true,
  })
);

// config des message flash, important :doit être déclarée après la config de la session
app.use(flash());

// import de middlewares customs
if (dev_mode === true) {
  app.use(require("./middlewares/devMode")); // active le mode dev pour éviter les deconnexions
  app.use(require("./middlewares/debugSessionInfos")); // affiche le contenu de la session
}
app.use(require("./middlewares/exposeLoginStatus")); // expose le status de connexion aux templates
app.use(require("./middlewares/exposeFlashMessage")); // affiche les messages dans le template

// app.locals.site_url = process.env.SITE_URL;

// view engine setup
// app.set('views', path.join(__dirname, '/views'));
app.set("views", __dirname + "/views");
app.set('view engine', 'hbs');

app.use(cors("*")); //toujours avant les use des routes
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + "/views/partials");


// routers use

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/userboard', require('./routes/userboard'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/ateliers', require('./routes/ateliers'));
app.use('/categories', require('./routes/categories'));
app.use('/articles', require('./routes/articles'));
app.use('/auth', require('./routes/auth'));


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
 