//console.log('getProject')
var assert=require('assert');
var mongodb = require('./db.js');
var ObjectID = require('mongodb').ObjectID;

function Admuser(resu) {
		this.auid = resu.auid;
		this.desid  =  resu.desid  ;
		this.projid  =  resu.projid  ;
		this.name  =  resu.name  ;
		this.passw  =  resu.passw  ;
		this.cancelstatus  =  resu.cancelstatus  ;
		
	};	
	
module.exports = Admuser;

//---project  文档的数据库操作.
		
// 1.FindOne   , 0: _id, 1:auid,  2.name  
	    
Admuser.AdmuserFindOne = function AdmuserFindOne(x, projID,val , callback){
	mongodb.open(function(err,db){
		//console.log('11');
		//console.log("Val:"+val);
		//console.log("x:"+x);		
		if(err) {mongodb.close(); return callback(err);}
		
		console.log('11');
		
		db.collection('admuser',function(err,collection){
			if(err) {console.log('22');mongodb.close(); return callback(err);}
			var nullerr=null;

			  //--开始数据库操作
		     switch(true)  
		     {
		     case x==0:
		    	      //console.log('11');
		    		var objID= new ObjectID(val);
				     collection.findOne({'_id' : objID, 'projid': projID } , function(err,doc){
						if(err) {callback(err);}	else {mongodb.close();callback(err,doc);  }	
					 });  
		    	 break;
		    
		     case x==1:
				
			     collection.findOne({'auid' :  val, 'projid': projID}   , function(err,doc){
						if(err) {callback(err);}	else {mongodb.close();callback(err,doc);}	
					 });   
		    	 break;
		    	 
		     case x==2:
			     collection.findOne({'name'  :  val , 'projid': projID}   , function(err,doc){
						if(err) {callback(err);}	else {mongodb.close();callback(err,doc);}	
					 });  
		    	 break;
		     
		     case true:
		    	 mongodb.close();
		    	 callback(nullerr);
		    	 break;	 
		     } //-switch end
		     
		});  //--db.collection end!
   });  //--mongodb.open end!
    
}   //Admuser.AdmuserFindOne  end



//2.insert

Admuser.AdmuserInsert = function   AdmuserInsert (newadmuser,callback) {
	mongodb.open(function(err,db) {
		if(err) {  return callback(err);}  
        db.collection('admuser',function(err,collection){
        	if(err) {  return callback(err);}
	        
        	//开始数据库操作
        	//var tmperr = 'System Error:project insert failed.';
    	    //collection.ensureIndex({'name':1, 'projid':1});
    	   // console.log(newproj);
        	console.dir(newadmuser);
    	    collection.insert({auid: newadmuser.auid  ,  desid: newadmuser.desid , projid : newadmuser.projid    ,  name : newadmuser.name , passw : newadmuser.passw   , cancelstatus : 1 }, function(err,doc){ 
    	    	if(err){
    	    		return callback(err);} 
    	    	else {
				   callback(err,doc);
    		    } 
    	    	
    	    });  //--collection.insert end!

      });  //--db.collection end!
	});   //--mongodb.open end!
}  //--desginsert function end!


//3. cancel 	 
//val: 1: _id, 2:auid,  3.name  

Admuser.cancelAdm = function cancelAdm(x, val , callback){
	mongodb.open(function(err,db){	
		if(err) return callback(err);
		var cursor=db.collection('admuser');

		switch (true) 
		{
		case  x==1 :
			var objID= new ObjectID(val);
		     cursor.update({_id: objID}, {$set: { cancelstatus : 0} }, {w:1}, function(err) {
		      if (err) return callback(err);
		      else return callback(err,true);
		    });
		   break;
		
		case  x==2 :
			console.log(val);
		     cursor.update({auid: val}, {$set: { cancelstatus : 0 }}, {w:1}, function(err) {
			      if (err) return callback(err);
			      else return callback(err,true);
			    });
			break;
			
		case x==3 :
			cursor.update({name:val}, {$set: {cancelstatus:0}}, {w:1}, function(err) {
				if(err) return callback(err);
				else return callback(err,true);
			});
			break;
		
		}
		
	
	});

}


	
// designer文档的数据库操作,END!  -->






































