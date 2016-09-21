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
		  var md5 = crypto.createHash('md5');
			 // password=md5.update(req.body['passw']).digest('base64');
				
			 // nam=req.body['admuser'];
		     // var  strn=toString(req.session.selectprjID);
			 // newuser.projosn[req.session.selectprjID]=1;
			  newuser.desid = req.session.designer['desid'];	
			  newuser.passw=md5.update(req.body['passw']).digest('base64');
		      newuser.name=req.body['username'];
	         //console.dir(newuser);
		    //console.log('check1:' +  req.body['mod1']);
		    //console.log('check2:' +  req.body['mod2']);    
		  // res.render('addaccountUser',{prjname : ''  ,   result: ' '});   	 
         

	           if(req.body['passw'] != req.body['passwdb'] ) 
				{
				  resutmp='两次密码输入不一致，请重新输入!';
				    Module.Getmodlist(req.session.selectprjID,function(err,n,resu){
				    	 if(err) {res.render('addaccountUser',{result: 'Error:Module.Getmodlist! '}); }
				      	 else {
				   	    	res.render('addaccountUser',{prjname :  req.body['prjname']  ,  con:n , modlist: resu , result:resutmp});   	    		
				    	  }	//--if end	
				     });  //--Module.Getmodlist end
				    
			    } else {     //req.body['username'] 
			    	User.UserFindOne(2 ,req.body['username']  ,  function(err, doc){
			    		//console.log('33');
			    		switch(true)   //-switch 01
			    		{
			    		case err != null :
							console.log(err);
			   	         	res.render('addaccountUser',{result: 'Error:UserFindOne  failed! '}); 
			   	    	    //DBclose.dbclosed();
			   	    	    break;
			   	    	    
		    		    case  doc != null  :	                                //如果没有错误，doc也不为空表示，用户已存在。 
			  		           resutmp = '用户：'+ req.body['username'] + ' 已存在！';		  	              
							    Module.Getmodlist(req.session.selectprjID,function(err,n,resu){
							    	 if(err) {res.render('addaccountUser',{result: 'Error:Module.Getmodlist! '}); }
							      	 else {
							   	    	res.render('addaccountUser',{prjname :  req.body['prjname']  ,  con:n , modlist: resu , result:resutmp});   	    		
							    	  }	//--if end	
							     });  //--Module.Getmodlist end
			                  break;    
			   	    	    
			    		case doc == null :                   //如果没有搜索到，则可以插入新用户数据
		                         
			    			 Idindex.idfindone(function(err,doc){
			       	              
			                    	switch (true) {     //switch 02
			                    	
			                    	case err != null :
			      	            	     resu='Error: addaccountUser.js--mark:02:idfindOne';
			  	            	         console.log(resu);  console.log(err);
			  	            	         res.render('addaccountUser',{result:resu });   
			  	            	         break;
			  	            	         
			                    	case doc==null:
			                    		  resu='Error: addaccountUser.js--mark:03:idfindOne--doc is null';
			  	            	          console.log(resu);  console.log(err);
			  	            	          res.render('addaccountUser',{result:resu });   
			  	            	         break;
			  	            	         
			                    	case err==null && doc!=null :        //如果没有错误，并且idindex成功返回数据，则：insert user
			                    	     resu = '';
			  	                         var newidindex = new  Idindex(doc);
			  	                          newuser.userid=doc.userid + 1;
			  	                         
			  	                          var mod={};
			  	                          
                                          for(var i=1; i<=req.body['n'];i++) {
                                        	  
			  	                        	   mod[parseInt( req.body['modID'+i])] = req.body['mod'+i] ; 
			  	                           }
			  	                          
			  	                          
			  	                        User.UserInsert(mod,req.session.selectprjID,newuser,function(err,doc){
			  	                    	 switch (true) 
			  	                    	 {  
			  	                           case err != null && doc == null :
		  	       	            	           resu='Error:addaccountUser.js---mark:04:addaccountUser insert error';
		  	   	            	              // console.log(resu);  console.log(err);
		  	   	            	               res.render('addaccountUser',{result:resu });   
		  	   	            	               break;
		  	   	            	               
			  	                           case doc !=null :
		  	                          	       Idindex.IdAdd(4,function(err,doc){
			                	                    if(err) {
		             	            	                 resu='Error: admadd.js--mark:05:desidAdd';
		             	                             	// console.log(resu);    console.log(err);    	            	               
		             	            	                 res.render('addaccountUser',{result:resu });   
		             	                             } else {  	                  
		             	                            	res.redirect('/adm');	
		           	                                 };   //--if end
		  	                          	       });  //-- Idindex.desidAdd end     

			  	                           break;
			  	                    	    }//switch end
			  	                    	   
			  	                       });  //  User.UserInsert end
			  	                      
			  	                       break;
			  	                       
			                    	}  //switch 02  end    	
			    			 });  //Idindex.idfindone
			    		
			    		break;
			    		
			    		}  //switch 01  end  
			
			   }); //UserFindOne_X  end 	
		
	    }//--if end

			    	

	 }  else {
			    	
		res.redirect('/admlogin');	
	}//--if  session end
});   //--Post end!


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
	   	    	res.render('addaccountUser',{result: 'Error:project findOne_X  failed!请返回主控制台，重新尝试 '}); 
	   	    	DBclose.dbclosed();
	   	    	break;
	   	    	
			case doc != null:        	
				req.session.selectprjID=doc.projid;
			    
			    Module.Getmodlist(doc.projid,function(err,n,resu){
			    	if(err) {res.render('addaccountUser',{result: 'Error:Module.Getmodlist! '}); }
			    	else {
			    		//req.body['n']=n;
			   	    	res.render('addaccountUser',{prjname : doc.name  ,  con:n , modlist: resu});   	    		
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

