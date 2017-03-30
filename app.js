var express = require('express');
var path = require('path');
//load sysconfig
var sysConfig = require('./config/sys')

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//导入mongoose配置
var mongoose = require('./config/mongoose')();

var routes = require('./routes');


var test = require('./mamager/test');

var index = require('./routes/index');
var member = require('./routes/member');
var parking = require('./routes/parkingLot');
var prepay = require('./routes/prepay');

//routes for test
var testroutes = require('./routes/testroutes')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/member', member);
app.use('/parking', parking);
app.use('/prepay', prepay);
app.post('/aaa', test.AAA);

app.use('/testroutes',testroutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//var port = 5001;
app.listen(sysConfig.port, function () {
    console.log('app is runing.... port:', sysConfig.port);
});