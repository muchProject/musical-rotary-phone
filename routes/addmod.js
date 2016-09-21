//console.log('admlogin');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var jsmodule = require('./module');
var Idindex =  require('./idindex');
var DBclose = require('./DBclose');
var Project = require('./project');


var newmodule =new jsmodule ({
	    modid   : '',
	    name     : '',
	    jsname    : '',
	    desid    : '',
	   projid     : '',
	   cancelstatus : 1,
});

router.post('/', function(req,res,next)  {
	
	if(req.session.designer != null  && req.session.selectprjID != null)  {  	                //如果session存在
		 // var md5 = crypto.createHash('md5');
		 // password=md5.update(req.body['passw']).digest('base64');
			
		 // nam=req.body['jsmodule'];
		  newmodule.desid = req.session.designer['desid'];
		  newmodule.projid=req.session.selectprjID;
		  
	      newmodule.name=req.body['modlename'];
	      var strtmp=req.body['jsname'];
	      newmodule.jsname=strtmp.replace(/\s+/g, ''); 
	      
         //console.dir(newmodule);
	    	jsmodule.jsmoduleFindOne(4 , newmodule.projid, req.body['modlename'], req.body['jsname'] ,  function(err, doc){
	    		console.log('33');
	    		switch(true)   //-switch 01
	    		{
	    		case err != null :
					console.log(err);
	   	         	res.render('addmod',{result: 'Error:jsmoduleFindOne findOne failed! '}); 
	   	    	    DBclose.dbclosed();
	   	    	    break;
	   	    	    
	   	    	    
    		    case  doc != null  :	                                //如果没有错误，doc也不为空表示，用户已存在。 
	  		           resu = '有这样一个功能模块：('+ doc.name+'--' + doc.jsname+')' + ' 已经存在并与你所输入的至少一个重名，请重新输入！';
	  	               console.log('result:功能模块已存在！');
	  		           res.render('addmod',{result:resu });
	  		           DBclose.dbclosed();
	                     break;    
	   	    	    
	    		case doc == null :                   //如果没有搜索到，则可以插入新用户数据
                         
	    			 Idindex.idfindone(function(err,doc){
	       	              
	                    	switch (true) {     //switch 02
	                    	
	                    	case err != null :
	      	            	     resu='Error: addmod.js--mark:02:idfindOne';
	  	            	         console.log(resu);  console.log(err);
	  	            	         res.render('addmod',{result:resu });   
	  	            	         break;
	  	            	         
	                    	case doc==null:
	                    		  resu='Error: addmod.js--mark:03:idfindOne--doc is null';
	  	            	          console.log(resu);  console.log(err);
	  	            	          res.render('addmod',{result:resu });   
	  	            	         break;
	  	            	         
	                    	case err==null && doc!=null :        //如果没有错误，并且idindex成功返回数据，则：
	                    	     resu = '';
	  	                         var newidindex = new  Idindex(doc);
	  	                          newmodule.modid=doc.modid + 1;
	  	                          
	  	                          //console.log(newmodule);
	       	                    
	  	                       jsmodule.jsmoduleInsert(newmodule,function(err,doc){
	  	                    	 switch (true) 
	  	                    	 {  
	  	                           case err != null && doc == null :
  	       	            	           resu='Error:addmod.js---mark:04:addmod insert error';
  	   	            	               console.log(resu);  console.log(err);
  	   	            	               res.render('addmod',{result:resu });   
  	   	            	               break;
  	   	            	               
	  	                           case doc !=null :
  	                          	       Idindex.IdAdd(5,function(err,doc){
	                	                    if(err) {
             	            	                 resu='Error: admadd.js--mark:05:desidAdd';
             	                             	 console.log(resu);    console.log(err);    	            	               
             	            	                 res.render('addmod',{result:resu });   
             	                             } else {
                  	                             	                   
             		        	                //console.log('RESU:' + resu);
                  	                           //  DBclose.dbclosed();
             	                            	res.redirect('/adm');	
            					                
           	                                 };   //--if end
  	                          	       });  //-- Idindex.desidAdd end     
	  	                           break;
	  	                    	    }//switch end
	  	                    	   
	  	                       });  //   jsmodule.jsmoduleInsert end
	  	                      
	  	                       break;
	  	                       
	                    	}  //switch 02  end    	
	    			 });  //Idindex.idfindone
	    		
	    		break;
	    		
	    		}  //switch 01  end  
	
	    	}); //jsmoduleFindOne  end 	

	
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
	   	    	res.render('addmod',{result: 'Error:project findOne_X  failed!请返回主控制台，重新尝试 '}); 
	   	    	DBclose.dbclosed();
	   	    	break;
	   	    	
			case doc != null:        	
				req.session.selectprjID=doc.projid;
	   	    	res.render('addmod',{prjname : doc.name  ,   result: ' '});   	    	
	   	    	break;
			
			}  //--switch end 
		}); //--Project.Prjfindone_X end 
		
	} else {
		
	res.redirect('/admlogin');	
	}  //if session end
});


module.exports = router;

