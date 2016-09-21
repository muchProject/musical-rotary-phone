//console.log('admlogin');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var admuser = require('./admuser');
var Idindex =  require('./idindex');
var DBclose = require('./DBclose');
var Project = require('./project');


var newadmuser =new admuser ({
	    auid   : '',
	   desid     : '',
	   projid    : '',
	   name    : '',
	   passw     : '',
	   cancelstatus : 1,
});

router.post('/', function(req,res,next)  {
	
	if(req.session.designer != null  && req.session.selectprjID != null)  {  	                //如果session存在
		  var md5 = crypto.createHash('md5');
		 // password=md5.update(req.body['passw']).digest('base64');
			
		 // nam=req.body['admuser'];
		  newadmuser.desid = req.session.designer['desid'];
		  newadmuser.projid=req.session.selectprjID;
		  newadmuser.passw=md5.update(req.body['passw']).digest('base64');
	      newadmuser.name=req.body['admuser'];
         //console.dir(newadmuser);
			
		  if(req.body['passw'] != req.body['passwdb'] ) 
			{
			  resu='两次密码输入不一致，请重新输入!';
			 res.render('addaccountAdm', {result:resu});
		    } else {
		    	admuser.AdmuserFindOne(2 , newadmuser.projid, req.body['admuser'] ,  function(err, doc){
		    		console.log('33');
		    		switch(true)   //-switch 01
		    		{
		    		case err != null :
						console.log(err);
		   	         	res.render('addaccountAdm',{result: 'Error:AdmuserFindOne findOne failed! '}); 
		   	    	    DBclose.dbclosed();
		   	    	    break;
		   	    	    
		   	    	    
	    		    case  doc != null  :	                                //如果没有错误，doc也不为空表示，用户已存在。 
		  		           resu = '用户：'+ req.body['admuser'] + ' 已存在！';
		  	               console.log('result:用户已存在！');
		  		           res.render('addaccountAdm',{result:resu });
		  		           DBclose.dbclosed();
		                     break;    
		   	    	    
		    		case doc == null :                   //如果没有搜索到，则可以插入新用户数据
	                         
		    			 Idindex.idfindone(function(err,doc){
		       	              
		                    	switch (true) {     //switch 02
		                    	
		                    	case err != null :
		      	            	     resu='Error: addaccountAdm.js--mark:02:idfindOne';
		  	            	         console.log(resu);  console.log(err);
		  	            	         res.render('addaccountAdm',{result:resu });   
		  	            	         break;
		  	            	         
		                    	case doc==null:
		                    		  resu='Error: addaccountAdm.js--mark:03:idfindOne--doc is null';
		  	            	          console.log(resu);  console.log(err);
		  	            	          res.render('addaccountAdm',{result:resu });   
		  	            	         break;
		  	            	         
		                    	case err==null && doc!=null :        //如果没有错误，并且idindex成功返回数据，则：
		                    	     resu = '';
		  	                         var newidindex = new  Idindex(doc);
		  	                          newadmuser.auid=doc.auid + 1;
		       	                    
		  	                       admuser.AdmuserInsert(newadmuser,function(err,doc){
		  	                    	 switch (true) 
		  	                    	 {  
		  	                           case err != null && doc == null :
	  	       	            	           resu='Error:addaccountAdm.js---mark:04:addaccountAdm insert error';
	  	   	            	               console.log(resu);  console.log(err);
	  	   	            	               res.render('addaccountAdm',{result:resu });   
	  	   	            	               break;
	  	   	            	               
		  	                           case doc !=null :
	  	                          	       Idindex.IdAdd(3,function(err,doc){
		                	                    if(err) {
	             	            	                 resu='Error: admadd.js--mark:05:desidAdd';
	             	                             	 console.log(resu);    console.log(err);    	            	               
	             	            	                 res.render('addaccountAdm',{result:resu });   
	             	                             } else {
	                  	                             	                   
	             		        	                //console.log('RESU:' + resu);
	                  	                           //  DBclose.dbclosed();
	             	                            	res.redirect('/adm');	
	            					                
	           	                                 };   //--if end
	  	                          	       });  //-- Idindex.desidAdd end     
		  	                           break;
		  	                    	    }//switch end
		  	                    	   
		  	                       });  //   Admuser.AdmuserInsert end
		  	                      
		  	                       break;
		  	                       
		                    	}  //switch 02  end    	
		    			 });  //Idindex.idfindone
		    		
		    		break;
		    		
		    		}  //switch 01  end  
		
		    	}); //AdmuserFindOne  end 	
		    }//--if end
	
	} else {
		res.redirect('/admlogin');	
	}//--if  session end
});   //--Post end!


router.get('/', function(req,res,next)  {
	var sid=req.query.sid;
	console.log(sid);
	
	if(req.session.designer != null &&  req.query.sid !=null)  {  	                //如果session存在
		req.session.selectprjID=null;
		Project.Prjfindone_X(0, req.query.sid, function(err,doc){
			switch (true) 
			{
			case err !=null || doc ==null :
				console.log(err);
	   	    	res.render('addaccountAdm',{result: 'Error:project findOne_X  failed!请返回主控制台，重新尝试 '}); 
	   	    	DBclose.dbclosed();
	   	    	break;
	   	    	
			case doc != null:        	
				req.session.selectprjID=doc.projid;
	   	    	res.render('addaccountAdm',{prjname : doc.name  ,   result: ' '});   	    	
	   	    	break;
			
			}  //--switch end 
		}); //--Project.Prjfindone_X end 
		
	} else {
		
	res.redirect('/admlogin');	
	}  //if session end
});


module.exports = router;

