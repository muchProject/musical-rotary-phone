var express = require('express');
var router = express.Router();




var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
module.exports = new Db("test", new Server("127.0.0.1",27107, {}));





router.get('/', function(req,res,next)  {
	res.render('boots',{result: 'resuuuiuuu'});
});


module.exports = router;

