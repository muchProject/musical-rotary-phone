var express = require('express');
var router = express.Router();
var Users = require('./user');
var mongodb = require('./db.js');
var Project=  require('./project');

router.get('/', function(req,res,next)  {
	//var sid=parseint(req.query.id);
	var sid=req.query.id;
	//var prjid=parseInt(req.query.prjid);
	//parseInt(sid);

	//console.log('ID:' +  sid);
	//console.log('prjid:' +  prjid);
	
	if(req.session.designer != null &&  sid != null)  {  	                //如果session存在
		mongodb.open(function(err,db){	
			if(err) return callback(err);
			Users.cancelUserProject(1, sid , '' , function(err,doc){
				Project.userProject_X( 0,sid, '' ,function(err,docUP){
				//console.log(doc);
				if(err != null)  res.send({des:err});
				else 
					Users.cancelUserMod(1, '',docUP.projid, docUP.userid  ,'' , function(err,UMtrue){
						if(err!=null) {res.send({des:err}); }
						else
							{
							//console.log("prjid:" +docUP.projid + ",useid:" +   docUP.userid   );
							Users.IsUserInOtherPrj(docUP.projid , docUP.userid ,  function(isFlag) {
					    		//console.log("flag:" + isFlag);
					    		if(isFlag==1)                   //如果此User不存在于其它项目（flag=0），则注销此用户
					    			res.send({des:true});
					    		else
					    			{
					    			   Users.cancelUser(2,docUP.userid ,'',function(err){
					    				   
					    				   if(err!=null) res.send({des:err});
					    				   else  res.send({des:true});
					    			   });
					    			}
					    		
					    	});   //Users.IsUserInOtherPrj  end
							
							}  //if end
					    	
						  
	
					}); 
				}); 		
			});

		})


	} else {
		
	res.send({des:'session out'});	
	}  //if session end

});


module.exports = router;











