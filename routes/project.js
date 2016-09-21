//console.log('Project')
var mongodb = require('./db.js');
//var User = require('./user');

var ObjectID = require('mongodb').ObjectID;
var async = require('async');
var assert=require('assert'); 
var EventProxy =   require('eventproxy');

function Project(project) {
		this.projid = project.desid;
		this.name = project.name;
	    this.desc = project.name;
		this.desgid = project.desgid;
		this.port = project.port;
	};	
	
module.exports = Project;

//---project  文档的数据库操作.
		
// 1.findone	-name
	    
Project.prjfindone = function prjfindone(prjname,callback){
	mongodb.open(function(err,db){
		if(err) {return callback(err);}
		db.collection('project',function(err,collection){
			if(err) { return callback(err);}
			  
			  //--开始数据库操作
		      // var tmp = new Designer({});
			   collection.findOne({name:prjname,  'cancelstatus' : 1},function(err,doc){
				if(err) {
					callback(err);
				}	else {
					callback(err,doc);
				}		
				
		    });  //collection.findone end!
			
		});  //--db.collection end!
   });  //--mongodb.open end!
}   //--designerfindone function end!
	
		
//2.findone_X	-x  0:_id, 1:projid 2:name

Project.Prjfindone_X = function Prjfindone_X(x, val ,callback){
	mongodb.open(function(err,db){
		if(err) {return callback(err);}
		db.collection('project',function(err,collection){
			if(err) { return callback(err);}
			var nullerr=null;
			//console.log("Val:"+val);
			//console.log("x:"+x);		
			  //--开始数据库操作
		     switch(true)  
		     {
		    
		     case x==0:
		    	      //console.log('11');
					var objID= new ObjectID(val);
				     collection.findOne({'_id' : objID } , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);  }	
					 });  
		    	 break;
		    
		     case x==1:
			     collection.findOne({'projid' :  val}   , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);}	
					 });   
		    	 break;
		    	 
		     case x==2:
			     collection.findOne({'name'  :  val}   , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);}	
					 });  
		    	 break;
		     
		     case true:
		    	 mongodb.close();
		    	 callback(nullerr);
		    	 break;	 
		     }
		     
		});  //--db.collection end!
   });  //--mongodb.open end!
}   //--designerfindone function end!


		
// 3.insert

Project.prjinsert = function prjinsert(newproj,callback) {
	mongodb.open(function(err,db) {
		if(err) {  return callback(err);}  
        db.collection('project',function(err,collection){
        	if(err) {  return callback(err);}
	        
        	//开始数据库操作
        	//var tmperr = 'System Error:project insert failed.';
    	    //collection.ensureIndex('name',{unique: true});
    	   // console.log(newproj);
    	    collection.insert({projid:newproj.projid  , name: newproj.name , desc: newproj.desc   , desgid: newproj.desgid ,  cancelstatus : 1, port: newproj.port }, {safe:true},function(err,doc){ 
    	    	if(err){
    	    		return callback(err);} 
    	    	else {
				   callback(err,doc);
    		    } 
    	    	
    	    });  //--collection.insert end!

      });  //--db.collection end!
	});   //--mongodb.open end!
}  //--desginsert function end!

		
//4. cancel project      cancelstatus: 0:注销， 1：正常

Project.PrjCancel = function PrjCancel(val,callback) {
	mongodb.open(function(err,db){
		if(err) { return callback(err);}
		db.collection('project',function(err,collection){
			if(err) {  mongodb.close(); return callback(err);}
			var nullerr=null;
			var objID= new ObjectID(val);
		
			console.log("ID:"+ val);
		
			collection.update({'_id' : objID }, {$set: {cancelstatus: 0}}, {w:1}, function(err) {
			      if (err) { console.warn(err.message);} 
			      else console.log('successfully updated');
			      callback(err);
			    });
			
			
			
			//console.log("Val:"+val);
			//console.log("x:"+x);		
	
	  });  //--db.collection end!
  });   //--mongodb.open end!
}   //--function end!

Project.Prjfindone_youxiao = function Prjfindone_youxiao( projid ,callback){
	mongodb.open(function(err,db){
		if(err)  return callback(err);
		db.collection('project').findOne({'projid':projid, 'cancelstatus':1},function(err,doc){
			
		      return callback(err, doc);
		});
	});
	
}


//X -- 0:_id, 1:userid,projid
Project.userProject_X = function userProject_X ( x,val, projid ,callback){
	mongodb.open(function(err,db){
		if(err)  return callback(err);
		var cursor=db.collection('userproject');
		switch(true)
		{
		case x==0:
			var objID= new ObjectID(val);
	        cursor.findOne({_id: objID}, function(err,doc) {
	         if (err) return callback(err);
	            else return callback(err,doc);
	         });
			break;
			
		case x==1:
			cursor.findOne({userid: parseInt(val), projid:parseInt(projid)}, function(err,doc) {
		         if (err) return callback(err);
		            else return callback(err,doc);
		         });
			break;		
		}
	});
	
}







Project.GetProjectList = function GetProjectList(userid,callback) {
	var Project=  require('./project');
	var fristPrj=0;
	mongodb.open(function(err,db){
		if(err)  return callback(err);
		var cursor = db.collection('userproject').find({'userid':userid, 'cancelstatus':1});
		cursor.toArray(function(err,doc){
			if(err) return callback(err);
			var n=0, nulltmp=null ,reslut = '';		
			
			if(doc.length==0) return callback(err, nulltmp,n);
			else
			{
				async.eachSeries(doc,function(val,callback){
					
					Project.Prjfindone_youxiao( val.projid ,function(err,prjdoc){ 
						//console.log(prjdoc);
						if(prjdoc ==null )  return 	callback(); 
						else
							{
							n++;  //console.log(prjdoc.name);
							if(n==1) {
								var prjtmp= 'prj'+n, hidtmp='hid'+n;
								reslut = reslut + "<li>";
								reslut = reslut + "<input tabindex=\'7\' type=\'radio\' id=\'"+prjtmp+"\' name=\'prj\'  checked  onclick=\"setSession('selecterPrj',"+prjdoc.projid+")\"   >";
								reslut = reslut + "<label for=\'minimal-radio-1\'> "+ prjdoc.name +" </label>";
								//reslut = reslut + "<input  type=\'hidden\' id=\'"+hidtmp+"\' name=\'"+ hidtmp+ "\'  value=\'"+prjdoc.projid + "\'   >";
								reslut = reslut + "</li>";
								fristPrj=prjdoc.projid;
								return 	callback(); 
							} else {
								var prjtmp= 'prj'+n, hidtmp='hid'+n;
								reslut = reslut + "<li>";
								reslut = reslut + "<input tabindex=\'7\' type=\'radio\' id=\'"+prjtmp+"\' name=\'prj\'  onclick=\"setSession('selecterPrj', "+prjdoc.projid+")\"    >";
								reslut = reslut + "<label for=\'minimal-radio-1\'> "+ prjdoc.name +" </label>";
								//reslut = reslut + "<input  type=\'hidden\' id=\'"+hidtmp+"\' name=\'"+ hidtmp+ "\'  value=\'"+prjdoc.projid + "\'   >";
								reslut = reslut + "</li>";
								return 	callback(); 
							}	//if end
						}  //if end
						
						
					});  //Prjfindone_X  end

				},  function(err) {
					 console.log(reslut);   return callback(err,reslut,n, fristPrj );
				});  //async.  end
			}   //if end 

		}); //cursor.toArray end 
		
	});  //mongodb.open end

}  //function end


function   cancelAdmuserAll(prjID, callback)
{  
	console.log('cancel Admuser All:' + prjID );
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('admuser');
		cursor.update({'projid' : prjID }, {$set: {cancelstatus: 0}}, {multi:true}, function(err) {
         if(err) console.log(err);
         return callback(err);
		});
		
	});
}
	

function   cancelmoduleAll(prjID, callback)
{console.log('cancel module All:' + prjID );
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('module');
		cursor.update({'projid' : prjID }, {$set: {cancelstatus: 0}}, {multi:true}, function(err) {
         if(err) console.log(err);
         return callback(err);
		});
		
	});
}
	
function   cancelusermoduleAll(prjID, callback)
{console.log('cancel usermodule All:' + prjID );
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('usermodule');
		cursor.update({'projid' : prjID }, {$set: {cancelstatus: 0}}, {multi:true}, function(err) {
         if(err) console.log(err);
         return callback(err);
		});
		
	});
}

function   canceluserprojectAll(prjID, callback)
{console.log('cancel userproject All:' + prjID );
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('userproject');
		cursor.update({'projid' : prjID }, {$set: {cancelstatus: 0}}, {multi:true} , function(err) {
         if(err) console.log(err);
         return callback(err);
		});
		
	});
}

function cancelusersAll(prjID,callback){
	console.log('cancel  cancelusersAll  All:' + prjID );
	var Users = require('./user');
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('userproject').find({'projid':prjID});
		cursor.toArray(function(err,doc){	

		  if(doc.length==0)   return callback(null); 
		   else {
			  async.eachSeries(doc,function(value,callback){
					//console.log(value);
					Users.IsUserInOtherPrj(prjID , value.userid ,  function(isFlag) {
			    		//console.log("flag:" + isFlag);
			    		if(isFlag==0)   //如果此User不存在于其它项目（flag=0），则注销此用户	
			    			{
			    			Users.cancelUser(2,value.userid ,'',function(err){
			    				
			    				   return callback();
			    			   });
			    			}	else return callback();
			    				
			    	});   //Users.IsUserInOtherPrj  end
					
				}, function(err){ 
					if(err) console.log('User Cancel failed!');
					else 
				       console.log('User Cancel successed!');
					return callback(err);
				})
			}
			
		});  // cursor.toArray end
		
		
	});
	
}



//cancel admuser,    module ,   usermodule, userproject;  users: 如果有用户只存在于此project中， 将其注销。
Project.cancelPrjAll = function cancelPrjAll(prjID, callback) {
	var ep =new EventProxy();
	var resul='ok';
	
	ep.all('usermod',function(usermod){
		cancelusersAll(prjID, function(err){
			console.log('5:User cancel OK.');
			console.log('Project Cancel Over!.');
			return callback(err,true);
		});
	});

	ep.all('userproject',function(usermod){
		cancelusermoduleAll(prjID, function(err){
			console.log('4:Usermodule cancel OK.');
			ep.emit( 'usermod' , resul);	
		});
	});
	
   ep.all('mod',function(usermod){
	    canceluserprojectAll(prjID, function(err){
	    	console.log('3:Userproject cancel OK.');
	    	ep.emit( 'userproject' , resul);	
		});
	});
	
	ep.all('adm',function(usermod){
		cancelmoduleAll(prjID, function(err){
			console.log('2:Mondule cancel OK.');
			ep.emit( 'mod' , resul);	
		});
	});
	
	cancelAdmuserAll(prjID, function(err){
		console.log('1:Admuser cancel OK.');
		ep.emit( 'adm' , resul);
	});
	
}





	
// designer文档的数据库操作,END!  -->






































