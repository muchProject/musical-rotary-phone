var express = require('express');
var router = express.Router();
var jsmodule = require('./module');
var mongodb = require('./db.js');

router.get('/', function(req,res,next)  {
	//var sid=parseint(req.query.id);
	var prjid=parseInt(req.query.prjid);
	var userid=parseInt(req.query.userid);
	var modid=parseInt(req.query.modid);
	var flag=parseInt(req.query.flag);
	
	//console.log(prjid);	console.log(userid);	console.log( modid);	console.log(flag);
	//parseInt(sid);

	
	if(req.session.designer != null )  {  	                //如果session存在
		mongodb.open(function(err,db){	
			if(err) return callback(err);
			
			if(flag==0)    //注销此用户功能权限
				{
				   jsmodule.cancelUserMod(1,  userid, prjid, modid, function(err,doc){
					   if(err != null)  res.send({des:err});
					    else res.send({des:true});	
			        	}); 	
				}
			
			if(flag==1)    //添加此用户功能权限
				{
				  jsmodule.addUserMod(1,  userid, prjid, modid, function(err,doc){
					   if(err != null)  res.send({des:err});
					    else res.send({des:true});	
			        	}); 			
				}		
			
			if(flag!=0 && flag!=1)  res.send({des:'unknow'});
			
			
			//jsmodule.cancelMod(2, sid , '' , function(err,doc){
			//	if(err != null)  res.send({des:err});
			//	else res.send({des:true});
			//});

		})
		


	} else {
		
	res.send({des:'session out'});	
	}  //if session end

});


module.exports = router;











