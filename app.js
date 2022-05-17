const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const countriesRoute = require('./source/routes/countries.route.v1');
dotenv.config();

const app = express();



// app.listen(process.env.PORT, () => {
console.log(`Your port is ${process.env.PORT}`)
// });

// view engine setup
app.set('view engine', 'ejs');

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', countriesRoute);

app.use('/', (req, res) => {res.render('index')});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
  // res.render('error');
});

module.exports = app;
