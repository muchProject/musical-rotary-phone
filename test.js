var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var app = express();


var jwt = require('jwt-simple');
var payload = { 
    foo: 'bafdrOOOOOOPPPPPPP',
    test: 'UUUYYSYYY',
    uuuu: 'dfijhjiowkfkj'
 };
var secret = 'yyy777';


var token = jwt.encode(payload, secret);


console.log(token);

try{
    
    var decoded = jwt.decode(token , secret);
console.log(decoded); //=> { foo: 'bar' }
}  catch(e) {
    
    console.log('ERR');
    
}


app.listen(6666 ,  function () {
	var time = new Date();
	console.log("总控制台:  prot:" +". Listen Succeed at:" + time );
	});





