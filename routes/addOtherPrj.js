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


router.post('/', function(req,res,next)  {
	
	if(req.session.designer != null  &&  req.session.selectprjID != null)  {  	                //如果session存在
		console.log(req.body);

		//console.log(selectUser);
		
         var mod={};
          
         for(var i=1; i<=req.body['n'];i++) {
       	  
         	   mod[parseInt( req.body['modID'+i])] = req.body['mod'+i] ; 
            }
         
         console.log(mod);
         
         
 		var selectUser=parseInt(req.body['mySelect']);
 		console.log(selectUser);
         
         User.UserInsert_V2(selectUser,mod,req.session.selectprjID,function(err,doc){
        	 if(err)   res.render('error',{message:err});  
        	 else
	     	res.redirect('/adm');	   	
         });
        	 

	 }  else {
			    	
		res.redirect('/admlogin');	
	}//--if  session end
});   //--Post end!








//var md5 = crypto.createHash('md5');
// password=md5.update(req.body['passw']).digest('base64');
	
// nam=req.body['admuser'];
// var  strn=toString(req.session.selectprjID);
// newuser.projosn[req.session.selectprjID]=1;
//  newuser.desid = req.session.designer['desid'];	
 //newuser.passw=md5.update(req.body['passw']).digest('base64');
// newuser.name=req.body['username'];
//console.dir(newuser);
//console.log('check1:' +  req.body['mod1']);
//console.log('check2:' +  req.body['mod2']);    
// res.render('addaccountUser',{prjname : ''  ,   result: ' '});   	 



router.get('/', function(req,res,next)  {
	var sid=req.query.sid;
	//console.log(sid);
	
	if(req.session.designer != null &&  req.query.sid !=null)  {  	                //如果session存在
		req.session.selectprjID=null;
		Project.Prjfindone_X(0, req.query.sid, function(err,doc){
			switch (true) 
			{
			case err !=null || doc ==null :
				console.log(err);
	   	    	res.render('addOtherPrj',{result: 'Error:project findOne_X  failed!请返回主控制台，重新尝试 '}); 
	   	    	DBclose.dbclosed();
	   	    	break;
	   	    	
			case doc != null:        	
				req.session.selectprjID=doc.projid;
			    
			    Module.Getmodlist(doc.projid,function(err,n,resu){
			    	if(err) {res.render('addOtherPrj',{result: 'Error:Module.Getmodlist! '}); }
			    	else {
			    		//req.body['n']=n;
			    		User.getOherUser(doc.projid, function(err,otherList, hidlistdoc){  
			    			res.render('addOtherPrj',{otherUsers:otherList ,hidlist:hidlistdoc   , prjname : doc.name  ,  con:n , modlist: resu}); 
			    		});
			   	    	  	    		
			    	}	//--if end
			    	
			    });  //--Module.Getmodlist end
			    break;
			    
			}  //--switch end 
		}); //--Project.Prjfindone_X end 
		
	} else {
		
	res.redirect('/admlogin');	
	}  //if session end
});


module.exports = router;

