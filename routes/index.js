var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var DBclose = require('./DBclose');
var User= require('./user');
var config = require('./config');
var EventProxy = require('eventproxy');
var async = require('async');

function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };

router.post('/',function(req,res,next) {
	var md5 = crypto.createHash('md5');
	var passw=md5.update(req.body['passw']).digest('base64');
	var username = req.body['username'];
	
	//console.log(req.body['username']);
	
	User.FindForLogin_X(2,  req.body['username'] , function(err,doc){
		//console.log(doc);
    	switch(true)
    	{
    	
    	case err !=null :
    		res.render('index' , {result: err});
		    break;
    	
    	case err ==null && doc ==null :
	    	res.render('index' , {result: '用户不存在!'});
	        break;
    		
    	case err ==null && doc !=null  && doc.passw != passw :  		
        	//DBclose.dbclosed();
    	    res.render('index' , {result:'密码错误！'});
    	    break;
    	
    	case err ==null && doc !=null  && doc.passw == passw : 
    		//登入成功，创建session

			var objj = {a: 1, b: 2};
			async.forEachOf(objj, function (value, key, callback) {
	           if(value == 1) {
				   req.session.users=doc;
    		       req.session.users.passw='';
			       callback();
			   }  else {  callback(); }	   

            }, function (err) {
	           if (err) console.log(err);
	           res.redirect('/projectSelecter');
            });
		
           break;
    	}
		
	});   //User.UserFindOne_X end
	

});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
