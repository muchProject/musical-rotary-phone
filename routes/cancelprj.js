var express = require('express');
var router = express.Router();
var DBclose = require('./DBclose');
var Project = require('./project');
var Idindex =  require('./idindex');

var newproject = new Project({
	projid : '',
	name : '',
    desc :  '',
	desgid : '',
});

router.post('/', function(req,res,next)  {

	if(req.session.designer != null   && req.session.cancelprjID != null)  {  	                //如果session存在
      
		console.log("ID:"+req.session.cancelprjID);
		
		Project.PrjCancel(req.session.cancelprjID,function(err){
			switch (true) 
			{
			case err !=null  :
				console.warn(err.message);
			    req.session.cancelprjID=null;
			    req.session.projid=null;
			  
   	    	    res.render('cancelprj',{result: 'Error:project cancel  failed! '}); 
				break;
			
			case err == null:     
				Project.cancelPrjAll(req.session.projid, function(err,truedoc){
					 req.session.cancelprjID=null;
					 req.session.projid=null;  
					 if(err) console.log(err);
				 	 res.redirect('/adm');
				});
			   
				break;
			}//--switch
		});  //--Project.PrjCancel end

	} else {
		 {res.redirect('/admlogin');}
	}  //--session if end
    
});   //--Post end!



router.get('/', function(req,res,next)  {
	
	var sid=req.query.sid;
	//console.log(sid);
	
	if(req.session.designer != null &&  req.query.sid !=null)  {  	                //如果session存在
		req.session.cancelprjID=null;
		req.session.projid=null;
		Project.Prjfindone_X(0, req.query.sid, function(err,doc){
			switch (true) 
			{
			case err !=null || doc ==null :
				console.log(err);
	   	    	res.render('cancelprj',{result: 'Error:project findOne_X  failed! '}); 
	   	    	DBclose.dbclosed();
	   	    	break;
	   	    	
			case doc != null:        	
				req.session.cancelprjID=req.query.sid;
			    req.session.projid=doc.projid;
	   	    	res.render('cancelprj',{prjname : doc.name  ,  prjdesc : doc.desc  ,  result: ' '}); 
	   	    	
	   	    	break;
			
			}  //--switch end 
		}); //--Project.Prjfindone_X end 
		
		
		
	} else {
		
	res.redirect('/admlogin');	
	}  //if session end

});


module.exports = router;

