var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//var tes= require('./routes/test');
//var boots= require('./routes/boots');

var Idindex = require('./routes/idindex');

var config = require('./routes/config');

var routes = require('./routes/index');
var users = require('./routes/users');
var login= require('./routes/login');

var aa= require('./routes/aa');
var adm = require('./routes/adm');
var addproj = require('./routes/addproj');
var admlogin = require('./routes/admlogin');
var admadd = require('./routes/admadd');

var cancelprj = require('./routes/cancelprj');
var addaccountAdm=require('./routes/addaccountAdm');
var addaccountUser=require('./routes/addaccountUser');
var addmod=require('./routes/addmod');

var cancelAdm=require('./routes/cancelAdm');
var cancelMod=require('./routes/cancelMod');
var cancelUser=require('./routes/cancelUser');
var updateUserModule=require('./routes/updateUserModule');

var ajaxUpdateUserModule=require('./routes/ajaxUpdateUserModule');
var projectSelecter=require('./routes/projectSelecter');
var  addOtherPrj= require('./routes/addOtherPrj');
var setSession= require('./routes/setSession');



var app = express();

// view engine setup


var fs = require('fs');

var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});

/*
app.use(express.logger({stream: accessLogfile}));


/*
 * 
 * 	app.error(function (err, req, res, next) {
	var meta = '[' + new Date() + '] ' + req.url + '\n';
	errorLogfile.write(meta + err.stack + '\n');
	next();
	});
 */


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('view options', { pretty: true });
//console.log('333;');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//console.log("3333");
var dbpath = 'mongodb://' + config.host +':'+config.port + '/' + config.db;
//console.log(dbpath);

var newstroe = new MongoStore({
	   url:dbpath,
	   ttl: 300,
	   });
//autoRemove: 'interval',
//autoRemoveInterval: 1 //     ttl: 7 * 24 * 60 * 60 // = 7 days. Default


//console.log(newstroe);

app.use(cookieParser());

app.use(session({
    secret:config.cookiesecret,
    resave: false,
    saveUninitialized: false,
    store: newstroe,
})
);


//console.log(express.session);

app.use(express.static(path.join(__dirname, 'public')));

//console.log('3333;');

//app.use('/test', tes);
//app.use('/boots', boots);

app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/aa', aa);
app.use('/adm',adm);
app.use('/addproj',addproj);
app.use('/admlogin',admlogin);
app.use('/admadd',admadd);

app.use('/cancelprj', cancelprj);
app.use('/addaccountAdm',  addaccountAdm);
app.use('/addaccountUser', addaccountUser );
app.use('/addmod', addmod);
app.use('/cancelAdm',cancelAdm);
app.use('/cancelMod', cancelMod );

app.use('/cancelUser', cancelUser );

app.use('/updateUserModule', updateUserModule);

app.use('/ajaxUpdateUserModule', ajaxUpdateUserModule);
app.use('/projectSelecter', projectSelecter);
app.use('/addOtherPrj', addOtherPrj);
app.use('/setSession', setSession);



//console.log('555;');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	//console.log('AAAAA');
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
//console.log('666;');

// production error handler
// no stacktraces leaked to user

var fs = require('fs');

var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});

/*
app.use(express.logger({stream: accessLogfile}));



 * 	app.error(function (err, req, res, next) {
	var meta = '[' + new Date() + '] ' + req.url + '\n';
	errorLogfile.write(meta + err.stack + '\n');
	next();
	});
 */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//console.log('7777;');

Idindex.idfindone(function(err,doc){
if(err) console.log(err);
else
app.listen(doc.homeport ,  function () {
	var time = new Date();
	console.log("总控制台:  prot:" + doc.homeport +". Listen Succeed at:" + time );
	});
});


module.exports = app;

//console.log('The End;');
