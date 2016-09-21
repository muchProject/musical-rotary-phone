var express = require('express');
var router = express.Router();
var DBclose = require('./DBclose');
var Project= require('./project');
var config = require('./config');
var EventProxy =  require('eventproxy');
var async = require('async');


function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };

router.post('/',function(req,res,next) {
    console.log(req.session.users);
	console.log(req.session.selecterPrj);
	if(req.session.users !=null && req.session.selecterPrj!=null ) {   
		var ep = new EventProxy();
	
		//console.log('Session PRJ:' + req.session.selecterPrj);
		//console.log(req.session);
	     var projid=0;
	
	      //res.render('error',{message:'ERROR TEST'})
	
		Project.Prjfindone_X(1, req.session.selecterPrj,function(err,doc){
			//console.log(doc.name +',port:' +doc.port);
		
		var objj = {a: 1, b: 2 , c:3};
		async.forEachOf(objj, function (value, key, callback) {
	
		  if(value == 1) {
			     req.session.selproject=doc;
				 req.session.selecterPrj=null;  
			     callback();
			   }  else {  callback(); }	  

		  }, function (err) {
			if (err) console.log(err);
			res.redirect("http://localhost:" + doc.port + "/"); 
		});
			
			
	  });
			
	} else {
		 res.redirect('/');
	}


});



/* GET */
router.get('/', function(req, res, next) {
	console.log(req.session.users);
	if(req.session.users !=null) {        //如果session 存在
			
		//console.log(req.session.users);
		Project.GetProjectList(req.session.users['userid'],function(err,list,n,fristPrj){
			switch(true)
	    	{
	    	case err !=null :
	    		 res.render('error',{message:err});
			    break;
	    	
	    	case err ==null && n==0 :
		    	res.render('error' , {message: 'warn: 此用户所在项目已经注销!'});
		        break;
		        
	    	case err ==null && n>0 :
	    		req.session.selecterPrj=fristPrj;
		    	res.render('projectSelecter' , {projectlist: list, con:n , username:req.session.users['name'],port:config.listenport});
		        break;
      
	    	}  //switch end	
		});
		
	
	} else {
		 res.redirect('/');
	}

});




module.exports = router;
