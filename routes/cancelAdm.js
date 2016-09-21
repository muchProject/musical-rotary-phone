var express = require('express');
var router = express.Router();
var admuser = require('./admuser');
var mongodb = require('./db.js');

router.get('/', function(req,res,next)  {
	//var sid=parseint(req.query.id);
	var sid=parseInt(req.query.id);
	//parseInt(sid);
	
	//console.log('Get:ID:' + req.query.id);
	//console.log(req.session.designer);
	//res.send({result: 'aa'});
	
	if(req.session.designer != null &&  sid != null)  {  	                //如果session存在
		mongodb.open(function(err,db){	
			if(err) return callback(err);
			admuser.cancelAdm(2,sid, function(err,doc){
				if(err != null)  res.send({des:err});
				else res.send({des:true});
			});
		})
		


	} else {
		
	res.send({des:'session out'});	
	}  //if session end

});


module.exports = router;

