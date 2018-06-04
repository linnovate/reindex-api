var express = require('express');
var expressValidator = require('express-validator');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config');
var cors = require('cors');
var jwt = require('jsonwebtoken');

var basePath = config.version;
var baseUrl = '/api/' + basePath;

var RateLimit = require('express-rate-limit');
var apiLimiter = new RateLimit({
  windowMs: 60*60*1000, // 60 minutes 
  max: 50,
  delayMs: 0 // disabled 
});

var routes = require('./routes');
var staticRoutes = require('./routes/statics');

var app = express();

if (app.get('env') === 'production') {
    var Raven = require('raven');
    Raven.config('https://228478d83caa4c5aa99eb18a1bcc94c6:058618189c28407994376ae43a7b8919@sentry.io/171608', {
        autoBreadcrumbs: true
    }).install();
    app.use(Raven.requestHandler());
}

// var passport = require('passport');

var consolidate = require('consolidate');
//require('./schedule')(app);
//require('./swagger/swagger')(app);

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'files')));

app.set('superSecret', config.tokenSecret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(expressValidator());
app.use(cookieParser());

app.use(cors());
// app.use(baseUrl + '/getResults', apiLimiter);

app.use(baseUrl, routes);
app.use('/', staticRoutes);

//for swagger-ui:
app.use('/swagger', express.static('./swagger/swagger-ui'));
// assign the template engine to .html files
app.engine('html', consolidate[config.templateEngine]);
// set .html as the default extension
app.set('view engine', 'html');

if (app.get('env') === 'production') {
   app.use(Raven.errorHandler());
}


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {}
    });
});

module.exports = app;