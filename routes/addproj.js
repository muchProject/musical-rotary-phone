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
	port : ''
});

router.post('/', function(req,res,next)  {

	if(req.session.designer != null)  {  	                //如果session存在
		newproject.name =req.body.projname;
		newproject.desc = req.body['projdes'];
		newproject.desgid = req.session.designer['desid'];
		newproject.port = req.body['port'];
		
		console.log('项目:' + newproject.name);	
		console.log('描述:' + req.body['projdes']);
		console.log('添加人ID:' +newproject.desgid);		
		console.log('添加人pass:' +req.session.designer['passw']);		
		console.log('端口:' + req.body['port']);
		//console.log(req.session.designer);	
		
		Project.prjfindone(req.body.projname,function(err,doc){
			switch (true) 
			{
			case err !=null :
				console.log(err);
	   	    	res.render('addproj',{result: 'Error:project findOne failed! '}); 
	   	    	DBclose.dbclosed();
	   	    	break;
	   	    	
			case doc != null:        
	   	    	res.render('addproj',{result: '此项目:' + newproject.name +'已经存在! '}); 
	   	    	DBclose.dbclosed();
	   	    	break;
	   	    	
			case doc == null:     //如果项目没有重名，则添加此项目
				Idindex.idfindone(function(err,doc){
				    if(err){
				    	console.log(err);
				    	res.render('addproj',{result: err}); 
				    	DBclose.dbclosed();
				    } else {
					     if(doc==null) 
					        {res.render('addproj',{result: 'SystemError:index find null! '}); DBclose.dbclosed();} 
					    else 
					       {
					    	newproject.projid = doc.projid + 1;
					    	//console.log(newproject);
					    	Project.prjinsert(newproject,function(err,doc){
					    	if(err)
					    	   {console.log(err);res.render('addproj',{result: 'Error:Project Insert  failed! '}); DBclose.dbclosed(); } 
					    	else 
					    	  {
							     if(doc)
							            {
							        	  Idindex.IdAdd(1,function(err,doc){
							        		if(err)
							        		  {console.log(err);  res.render('addproj',{result: 'IDadd ++ failed.！ '});
							        		  DBclose.dbclosed(); }
							        		else
							        		 {DBclose.dbclosed(); res.redirect('/adm');  }
							        	   });  //  Idindex.IdAdd end
							            }
							      else
							         {res.render('addproj',{result: 'unknow！'}); 
							         //DBclose.dbclosed();
							         }  
							    } // if end	
					    	 });   //Project.prjinsert end
					       }  // if end	
				    } //--if end
			    });  //-Idindex.idfindone
	   	    	
	   	   break;
			}//--switch end!
			
		});  //--Project.prjfindone end!

	} else {
		 {res.redirect('/admlogin');}
	}  //--session if end
    
});   //--Post end!



router.get('/', function(req,res,next)  {
	if(req.session.designer != null)  {
		console.log('Addproj get succeed');
		res.render('addproj',{result: ''});
	} else {
		 {res.redirect('/admlogin');}
	}
	
});


module.exports = router;

