//console.log('admlogin');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var designer = require('./designer');
var Idindex =  require('./idindex');
var DBclose = require('./DBclose');

router.post('/', function(req,res,next)  {

  var md5 = crypto.createHash('md5');
  password=md5.update(req.body['passw']).digest('base64');
	
  nam=req.body['admuser'];
	
	//passdb=req.body['passwdb'];
	//passworddb=md6.update(req.body['passwdb']).digest('base64');
	//password_2=md5.update(req.body['passw2']).digest('base64');
	//console.log('用户名,密码:' + nam  + ',' + password2);

	var newdeigner = new designer({
		desid:'',
		name: req.body['admuser'],
		passw: password,
	});
	
	if(req.body['passw'] != req.body['passwdb'] ) 
	{
	  resu='两次密码输入不一致，请重新输入!';
	 res.render('admadd', {result:resu});
    } else {
    	designer.desfindone(req.body['admuser'], function(err,doc){	    
    		switch(true)    //--switch 01
    		{
    	     	case err != null :                                                              //如果err不为空
    	     		resu='Error: admadd.js--mark:01:desfindone';
    			    console.log(resu); 
    			    console.log(err);
    			    res.render('admadd',{result:resu });  
    			    DBclose.dbclosed();
    			    break;
    
    		    case err==null && doc != null  :	                                //如果没有错误，doc也不为空表示，用户已存在。 
 		           resu = '用户：'+ nam + ' 已存在！';
 	               console.log('result:用户已存在！');
 		           res.render('admadd',{result:resu });
 		          DBclose.dbclosed();
                    break;
     		    	 
		        case doc==null :                                                          //如果doc为空，则表示数据库没此客户，可以添加此用户
                    Idindex.idfindone(function(err,doc){
       	              
                    	switch (true) {     //switch 02
                    	
                    	case err != null :
      	            	     resu='Error: admadd.js--mark:02:idfindOne';
  	            	         console.log(resu);  console.log(err);
  	            	         res.render('admadd',{result:resu });   
  	            	         break;
  	            	         
                    	case doc==null:
                    		  resu='Error: admadd.js--mark:03:idfindOne--doc is null';
  	            	          console.log(resu);  console.log(err);
  	            	          res.render('admadd',{result:resu });   
  	            	         break;
  	            	         
                    	case err==null && doc!=null :        //如果没有错误，并且idindex成功返回数据，则：
                    	     resu = '';
  	                         var newidindex = new  Idindex(doc);
  	                         newdeigner.desid=doc.desid + 1;
       	                    
  	                         designer.desginsert(newdeigner,function(err,doc) {     //insert 账户信息
  	                        	  switch (true) {   //--switch 03
  	                        	 
  	                        	  case err != null :
  	       	            	           resu='Error: admadd.js--mark:02:desginsert';
  	   	            	               console.log(resu);  console.log(err);
  	   	            	               res.render('admadd',{result:resu });   
  	   	            	               break;
  	                        	  
  	                          	  case doc==null:
  	                    		        resu='Error: admadd.js--mark:04:desginsert--doc is null';
  	  	            	                console.log(resu);  console.log(err);
  	  	            	                res.render('admadd',{result:resu });   
  	  	            	               break;
  	  	            	               
  	                            case err==null && doc!=null :     //插入成功，则，idindex--desid自加1
  	                          	       Idindex.desidAdd(function(err,doc){
	                	                    if(err) {
             	            	                 resu='Error: admadd.js--mark:05:desidAdd';
             	                             	 console.log(resu);    console.log(err);    	            	               
             	            	                 res.render('admadd',{result:resu });   
             	                             } else {
                  	                            resu = '用户：'+ nam + ' 添加成功！';         	                   
             		        	                //console.log('RESU:' + resu);
            					                res.render('admadd',{result:resu }); 
            					                DBclose.dbclosed();
           	                                 };   //--if end
  	                          	       });  //-- Idindex.desidAdd end     
  	                          		
  	                          		  break;        	  
  	                        	  }  //--switch 03 end
      	  
       	                      } );  //  -- designer.desginsert  end
  	                         
  	                         break;
                    	
                    	}  //-switch 02 end 
 	 
       	             });   //--Idindex.idfindone end

			        break;

    	   	}//--swtich 01  end!
       });  //--desfindone end!
    	
    	
    	
   }//--if end

});   //--Post end!


router.get('/', function(req,res,next)  {
	console.log('get');
	res.render('admadd',{result: ''});
});


module.exports = router;

