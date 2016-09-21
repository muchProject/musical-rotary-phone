var express = require('express');
var router = express.Router();
var jsmodule = require('./module');
var mongodb = require('./db.js');
var Users = require('./user');

router.get('/', function(req,res,next)  {
	//var sid=parseint(req.query.id);
	var sid=parseInt(req.query.id);
	//parseInt(sid);

	
	if(req.session.designer != null &&  sid != null)  {  	                //如果session存在
		mongodb.open(function(err,db){	
			if(err) return callback(err);
			jsmodule.cancelMod(2, sid , '' , function(err,doc){
				if(err != null)  res.send({des:err});	
				else 
				Users.cancelUserMod(2, '', '' , '' , sid, function(err,UMdoc){
					if(err!=null) res.send({des:err});
					else  res.send({des:true});
				}); 
				
			});

		})
		


	} else {
		
	res.send({des:'session out'});	
	}  //if session end

});


module.exports = router;











