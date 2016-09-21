//console.log('admlogin');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('./user');
var Idindex =  require('./idindex');
var DBclose = require('./DBclose');
var Project = require('./project');
var Module= require('./module');
var cheerio = require('cheerio');
//var EventProxy =   require('eventproxy');


var newuser =new User ({
     userid :  '',
	 auid :   '',
	 desid  :    '' ,
	 name  :    '',
	 passw  :   '',
	 cancelstatus : 1,
});

router.get('/', function(req,res,next)  {
	var userid=req.query.sid;
	var prjid=parseInt(req.query.prjid);
	//console.log(sid);
	//console.log('userid:' + userid + ", prjid:" + prjid);
	
	if(req.session.designer != null &&  req.query.sid !=null)  {  	                //如果session存在
		req.session.updatePrjID=null;
		req.session.updateUserID=null;
		

		Project.Prjfindone_X(1, prjid, function(err,doc){
			switch (true) 
			{
			case err !=null || doc ==null :
				console.log(err);
	   	    	res.render('updateUserModule',{result: 'Error:project findOne_X  failed!请返回主控制台，重新尝试 '}); 
	   	    	break;
	   	    	
			case doc != null:      
				//console.log(doc);
				User.UserFindOne_X(0, prjid , userid ,function(err,userdoc){
					//console.log(userdoc);
					req.session.updatePrjID=prjid;
				    req.session.updateUserID=userdoc.userid;			
				    
				    Module.GetUsermodlist(doc.projid, userdoc.userid  ,function(err,n,resu){
				    	
				    	if(err) {res.render('updateUserModule',{result: 'Error:Module.Getmodlist! '}); }
				    	else {
				    		//req.body['n']=n;
				   	    	res.render('updateUserModule',{prjname : doc.name  ,  con:n , modlist: resu , username:userdoc.name});   	    		
				    	}	//--if end
				    	
				    });  //--Module.Getmodlist end
					
				});
				
			    break;
			    
			}  //--switch end 
		}); //--Project.Prjfindone_X end 
		
	} else {
		
	res.redirect('/admlogin');	
	}  //if session end
});


module.exports = router;

