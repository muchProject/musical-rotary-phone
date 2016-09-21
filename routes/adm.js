var express = require('express');
var router = express.Router();
var getproject=require('./getproject');
var assert=require('assert');
var config = require('./config');
var moment = require('moment');

function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };

 //sleep(10000);  等待10秒。



router.get('/', function(req,res,next)  {
	console.log(req.session.designer)
	if(req.session.designer != null)  {
		
	getproject.Getprj(function(err,result ){
		assert.equal(err,null);
			//console.log(reu);

		getproject.Getcollections(function(err,colles) {
			assert.equal(err,null);
			//var date = new Date();
			//var day =  date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
			
             
	     	moment().format('LL');
			var day = moment().format("MMM Do YY");
			console.log('Adm--Get:Success');		
			
			res.render('adm',{ designer : req.session.designer['name'],   date:day ,     prjlist: result  ,manageList : colles  });
		  });  //--getproject.Getcollections
	  
	   });  //--getproject.Getprj end
		
	} else {
		//如果没有session信息，则重新进入登陆界面
	    res.redirect('/admlogin');   
	}
	
});   //get  end!



module.exports = router;








/*


*/










