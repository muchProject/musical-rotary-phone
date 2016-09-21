var express = require('express');
var router = express.Router();
var DBclose = require('./DBclose');
var Project= require('./project');
var config = require('./config');


function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };


/* GET */
router.get('/', function(req, res, next) {
	if(req.session.users !=null) {        //如果session 存在
		//console.log(req.query);
		var key=req.query['key'];
		var value=parseInt(req.query.value);
		console.log(req.query['key']);console.log(value);
		
		req.session[key]=parseInt(req.query.value);
		
		//console.log(req.session);
	    
	    
	    res.send({des:true});	
	
	} else {
		res.send({des:'session out'});	
	}

});




module.exports = router;
