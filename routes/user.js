//console.log('getProject')
var assert=require('assert'); 
var async = require('async');
var EventProxy =   require('eventproxy');
var mongodb = require('./db.js');
var Project = require('./project');
var ObjectID = require('mongodb').ObjectID;


function User(resu) {
	    this.userid = resu.userid;
		this.auid = resu.auid;
		this.desid  =  resu.desid  ;
		this.name  =  resu.name  ;
		this.passw  =  resu.passw  ;
		this.cancelstatus  =  resu.cancelstatus  ;
	};	
	
module.exports = User;

//--function


//1.FindOne   , 0: _id, 1:userid,  2.name  
User.UserFindOne = function  UserFindOne(x, val  ,  callback) {
	
		//console.log('11');
		//console.log("Val:"+val);
		//console.log("x:"+x);	
		//console.log("projID:"+projID);	
	mongodb.open(function(err,db){
		if(err) {return callback(err);}
		var  cursor= db.collection('users');

			  //--开始数据库操作
		     switch(true)  
		     {
		     case x==0: 
		    		var objID= new ObjectID(val);
		            cursor.findOne({'_id' : objID  } , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);  }	
					 });  
		    	 break;
		    
		     case x==1: 
		    	 cursor.findOne({'userid' :  val }   , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);}	
					 });   
		    	 break;
		    	 
		     case x==2:  
		    	 cursor.findOne({'name' :  val , 'cancelstatus':1}   , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);}	
					 });   
		    	 break;

		     } //-switch end
		     
   });  //--mongodb.open end!
	
	
}



//--function end



//---users  文档的数据库操作.
		
// 1.FindOne   , 0: _id, 1:userid,  2.name  
	    
User.UserFindOne_X = function UserFindOne_X(x, projID,val , callback){
	mongodb.open(function(err,db){
		
		//console.log('11');
		//console.log("Val:"+val);
		//console.log("x:"+x);	
		//console.log("projID:"+projID);	
		if(err) {mongodb.close(); return callback(err);}
		var tt=0;
	   // var cursor =db.collection('userproject');
	  //  assert.equal(err,null);
		db.collection('users',function(err,collection){
			if(err) {mongodb.close(); return callback(err);}
			var nullerr=null;
			  //--开始数据库操作
		     switch(true)  
		     {
		     case x==0:
		    	      //console.log('11');
		    		var objID= new ObjectID(val);
				     collection.findOne({'_id' : objID  } , function(err,doc){
						if(err) {callback(err);}	else {mongodb.close();callback(err,doc);  }	
					 });  
		    	 break;
		    
		     case x==1: 
				
			     collection.findOne({'userid' :  parseInt(val) }   , function(err,doc){
						if(err) {callback(err);}	else {callback(err,doc);}	
					 });   
		    	 break;
		    	 
		     case x==2:  
					var cursor_users =db.collection('users').find( {'name':val ,'cancelstatus' : 1} );
				    var cursor_usersproject =db.collection('userproject');	
				    var flg=0, t=0;nulltmp=null;
				    var  nullerr=null, reuu=null;
				  
   		    	 cursor_users.toArray(function(err, doctmp) {
 		    	    if(doctmp.length==0)       {return callback(nulltmp); } 
 		    	    else
 		    	    { 	    	
 		    	       async.eachSeries(doctmp, function(value, callback){
 		    	    	  cursor_usersproject.findOne({'userid':value.userid ,  'projid': projID, 'cancelstatus' : 1  },function(err,result) {
 		    	    	  assert.equal(err,null);
 		    			  if(result !=null)  {reuu=value;flg=1;  return callback(err); }
 		    			  else
 		    				 return callback(); 
                           });		//--cursor_usersproject.findOne	 
 		    	    	
                         }, function(err) {
 		    	    		if(err)  console.log(err);  
 		    	    		return callback(nullerr,reuu);
 		    	        } );   //async.eachSeries  end
 		    	    	
 		    	   }  //--if  end     		       
                });     //--cursor_users.toArray end	    		
              
   		    	 break;
		     
		     case (x!=0 && x!=1 && x!=2):
		    	 mongodb.close();
		    	 callback(nullerr);
		    	 break;	 
		     } //-switch end
		     
		});  //--db.collection end!
   });  //--mongodb.open end!
    
}   //User.UserFindOne  end



//2.insert

User.UserInsert = function   UserInsert (mod,prjID,newUser,callback) {
	//var projosn = 'projosn.' + prjID;
	mongodb.open(function(err,db) {
		if(err) {  return callback(err);}  
        db.collection('users',function(err,collection){
        	if(err) {  return callback(err);}
	        var nulldoc=null, nulltmp=null;
    	    var cursor =db.collection('userproject');
    	    var cursor_mod =db.collection('usermodule');
    	    
    	    assert.equal(err,null);
        	//开始数据库操作
 	    	
    	    var ep = new EventProxy();
 	    	ep.all('userinsert', 'userproject', 'usermodule', function (userinsert, userproject, usermodule) { 
 	    	     switch (true)
 	    	     {
 	    	     case   userinsert  != null:
 	    	    	 return  callback(userinsert);
 	    	        break;
 	    	    
 	    	     case   userproject != null:
 	    	    	 return  callback(userproject);    	     
	    	        break;
	    	        
 	    	     case    usermodule  != null:
 	    	    	 return  callback(usermodule );    	     
	    	        break;
 	    	     
 	    	     case  userinsert  == null  &&  userproject == null  &&  usermodule ==null  :
 	    	    	return  callback(err,nulltmp);
  	    	        break;
 	    	     }
 	    		
 	    	}); //--ep.all


    	    collection.insert({userid:newUser.userid,  auid: newUser.auid  ,  desid: newUser.desid , name : newUser.name , passw : newUser.passw   , cancelstatus : 1 }, function(err,doc){ 
    	    	if(err){  return callback(err);} 
    	    	else {
    	    	   //nulltmp=doc;ep.emit('userinsert', nulldoc);	
    	    	
    	    	   //insert  userproject.
      	         cursor.insert({'userid':newUser.userid  ,  'projid':prjID  , 'cancelstatus' : 1 }, function(err,result){ 
    	            if(err){  return callback(err);} 
    	            else {
        	              //insert usermodule
        	              console.log(mod);
           	          async.forEachOf(mod, function (value, key, callback) {
      	    	          if(value=='on') 
      	    	          {  var keytmp = parseInt(key);
      	    	             cursor_mod.insert({'userid':newUser.userid  ,modid: keytmp  ,  'projid':prjID  , 'cancelstatus' : 1 }, function(err,result){  
      	    	        	     if(err)  {console.log(err); nulltmp=err;  } 
      	    	        	   callback();
      	    	        	  });  //cursor_mod.insert  end
      	    	         
      	    	          }  else { callback(); }   //if end
      	    	    	   
      	             }, function (err) {
     	    		        if(err!=null || nulltmp !=null) { return callback(err); }
     	    		     else {return callback(err,doc); }  
      	    	    }); //---async.forEachOf
           	          
    	            }  	//if end          
      	          });  //---cursor.insert end 	
    	       }  // if end
            });  //--collection.insert end!  	


      });  //--db.collection end!
	});   //--mongodb.open end!
}  //--desginsert function end!





User.UserInsert_V2 = function   UserInsert_V2 (userid,mod,prjID,callback) {
	//var projosn = 'projosn.' + prjID;
	mongodb.open(function(err,db) {
		if(err) {  return callback(err);}  
        db.collection('users',function(err,collection){
        	if(err) {  return callback(err);}
	        var nulldoc=null, nulltmp=null;
    	    var cursor =db.collection('userproject');
    	    var cursor_mod =db.collection('usermodule');
    	   
    	    	   //nulltmp=doc;ep.emit('userinsert', nulldoc);	
    	    	
    	    	   //insert  userproject.
      	         cursor.insert({'userid':userid  ,  'projid':prjID  , 'cancelstatus' : 1 }, function(err,result){ 
    	            if(err){  return callback(err);} 
    	            else {
        	              //insert usermodule
        	              //console.log(mod);
           	          async.forEachOf(mod, function (value, key, callback) {
      	    	          if(value=='on') 
      	    	          {  var keytmp = parseInt(key);
      	    	             cursor_mod.insert({'userid':userid  ,modid: keytmp  ,  'projid':prjID  , 'cancelstatus' : 1 }, function(err,result){  
      	    	        	     if(err)  {console.log(err); nulltmp=err;  } 
      	    	        	   callback();
      	    	        	  });  //cursor_mod.insert  end
      	    	         
      	    	          }  else { callback(); }   //if end
      	    	    	   
      	             }, function (err) {
     	    		        if(err!=null || nulltmp !=null) { return callback(err); }
     	    		     else {return callback(err,true); }  
      	    	    }); //---async.forEachOf
           	          
    	            }  	//if end          
      	          });  //---cursor.insert end 	



      });  //--db.collection end!
	});   //--mongodb.open end!
}  //--desginsert function end!




function IsModuleExist(modid,callback) {
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('module').find({'modid':modid , 'cancelstatus':1});
		cursor.toArray(function(err,doc){
			if(doc.length == 0)  return callback(0);
			else
				 return callback(1);
		});
		
	});
}

User.usermodule = function usermodule(projid,userid,callback) {
	mongodb.open(function(err,db) {
		assert.equal(err,null);
		var nulltmp=null , result = '代码:' , resultnull = '代码:Null';
        var cursor = db.collection('usermodule').find({'userid':userid, 'projid':projid, 'cancelstatus':1});
       // assert.equal(err,null);
        cursor.toArray(function(err, doc){
        	if(doc.length == 0) return callback(err,resultnull);
        	else
        		{
        		var i=0;
        		async.eachSeries(doc, function(value, callback){
        			i++;
        			IsModuleExist(parseInt(value.modid), function(flag){
        				//console.log('Flag:' + flag +', ID:' +value.modid );
        				if(flag==0) callback(); 
        				else 
        					{
         			            if(i==doc.length) { result  =result + value.modid ; callback();  }
     			                else
     				            {result  = result + value.modid +"," ;  callback();  }	
        					}
        				
        			});
        			
		
        		}, function(err){ return callback(err,result);});
 		
            }  //if end
        	
        });  //--cursor toArray END

	});   //--mongodb.open end!
		
}

//此用户是否还属于其它项目之中
User.IsUserInOtherPrj  = function IsUserInOtherPrj(projid,userid,callback) {
	//console.log('in');
	mongodb.open(function(err,db){
		assert.equal(err,null);
		//console.log(projid);  console.log(userid);    
		var cursor=db.collection('userproject').find({'userid':parseInt(userid), 'projid':{$ne:parseInt(projid)} , 'cancelstatus':1});
		cursor.toArray(function(err,doc){
			//console.log(doc);
			if(doc.length == 0)  return callback(0);
			else
				 return callback(1);
		});		
	});
}


function IsUserInPrj(projid,userid,callback){
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('userproject').find({'userid':userid, 'projid':projid , 'cancelstatus':1});
		cursor.toArray(function(err,doc){
			if(doc.length == 0)  return callback(0);
			else
				 return callback(1);
		});
		
	});
}







 function PrjandUser_youxiao(userid, projid ,callback){
	 var flag=1;
	mongodb.open(function(err,db){
		if(err)  return callback(err);
		var cursor_user=db.collection('users').find({'userid':parseInt(userid), 'cancelstatus':0});
		var cursor_prj=db.collection('project').find({'projid':parseInt(projid), 'cancelstatus':0});
		
		cursor_user.toArray(function(err,userdoc){
			if(userdoc.length != 0)  return callback(0);
			else
				cursor_prj.toArray(function(err,prjdoc){
					if(prjdoc.length != 0)  return callback(0);
					else
					 return callback(1);
				});
				 
		});
	
	});
	
}

User.getOherUser  = function getOherUser(projid, callback) {
	var Usertmp = require('./user');
	mongodb.open(function(err,db) {
		assert.equal(err,null);
		var nulltmp=null , n=0, result = '' , resultnull =null, hidtmp='';
        var cursor = db.collection('userproject').find({'cancelstatus':1});
        cursor.toArray(function(err, doc){
        	if(doc.length == 0) return callback(err,resultnull);
        	else
        		{
        		var i=0;
        		async.eachSeries(doc, function(value, callback){

        					if(value.projid !=projid ){
        						
        						PrjandUser_youxiao(value.userid, value.projid , function(puflag){
        							if(puflag==0)  callback();   //如果Project 或User被注销了
        							else
        							{
        								IsUserInPrj(projid,value.userid,function(upflag){
        									if(upflag==1)   //如果此用户属于此项目中
        										callback();
        									else
        										{
        										i++;
        										var  inputtmp='inputtmp'+i;					
                							    Usertmp.UserFindOne_X(1, value.projid,value.userid , function(err,userdoc){
                								
                							    Project.Prjfindone_X(1,value.projid ,function(err,prjdoc){
                							     result = result  + "<option  value='" + value.userid + "'>"+ prjdoc.name + "---> " + userdoc.name + "</option>  ";	    
                								//hidtmp= hidtmp + " <input type='text'  id='"+inputtmp+"'   name='"+inputtmp+"'   value='" + value.userid + "' > ";
                								callback();
                							    });
                							    });
        										}
        										
                								
        								});
        							
            							
            							
            							
        							}  //if end
        							
        						}); 	
        						
        					}  else {callback();}
        				
		
        		}, function(err){
        			//console.log(result);
        			
        			if(i==0) return callback(err,'','');
        			else
        			return callback(err,result, hidtmp);});
 		
            }  //if end
        		
        }); // cursor.toArray  end
	
   });  //mongodb.open  end
}






//cancel   val: 1: _id, 2:userid,  3.name  
User.cancelUser=function cancelUser(x,val,prjid,callback) {
	mongodb.open(function(err,db){	
		if(err) return callback(err);
		var cursor=db.collection('users');

		switch (true) 
		{
		case  x==1 :
			var objID= new ObjectID(val);
		     cursor.update({_id: objID}, {$set: { cancelstatus : 0} }, {w:1}, function(err) {
		     return  callback(err,true);
		    });
		   break;
		
		case  x==2 :
			console.log(val);
		     cursor.update({userid: val}, {$set: { cancelstatus : 0 }}, {w:1}, function(err) {
		    	 return   callback(err,true);
			    });
			break;
			
		case x==3 :
			cursor.update({projid:prjid,  name:val}, {$set: {cancelstatus:0}}, {w:1}, function(err) {
				return callback(err,true);
			});
			break;

		}

	});	
}


	

	//cancel   UserProject   val : 1:_id  ,2 :userid
	User.cancelUserProject=function cancelUserProject(x,val,prjid,callback) {
		mongodb.open(function(err,db){	
			if(err) return callback(err);
			var cursor=db.collection('userproject');

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
			     cursor.update({userid: val, projid: prjid}, {$set: { cancelstatus : 0 }},  function(err) {
				      if (err) return callback(err);
				      else return callback(err,true);
				    });
				break;

			}

		});	
}
	//x:0:_id, 1,projid and userid,   2. modid
	User.cancelUserMod = function cancelUserMod(x, i_d ,projid, userid  ,modid , callback) {
		mongodb.open(function(err,db){
			if(err) callback(err);
			var cursor=db.collection('usermodule');
			
			switch(true)
			{
			case x==0:
				var objID= new ObjectID(i_d);
		        cursor.update({_id: objID}, {$set: { cancelstatus : 0} }, {w:1}, function(err) {
		               return callback(err,true);
		        });

				break;
			
			case x==1:
				//console.log('PRJ:'+projid + '|USERID:' + userid);
				cursor.update( {'projid': parseInt(projid)  ,'userid': parseInt(userid)}, {$set:{cancelstatus:0}},  {multi:true} , function(err) {
					//console.log(doc);  
					return callback(err,true);
		        });
				break;
			
			case x==2:
				//console.log("modid:" +modid);
				cursor.update( {'modid': parseInt(modid) }, {$set:{cancelstatus:0}},  {multi:true} , function(err) {
					//console.log(doc);  
					callback(err,true);
		        });
				break;	
			}		
			
		});
		
		
	}
	


//--user find for login
	// 1.FindOne   , 0: _id, 1:userid,  2.name  
	
	User.FindForLogin_X = function FindForLogin_X(x, val , callback){
		mongodb.open(function(err,db){
			//console.log("Val:"+val);
			//console.log("x:"+x);	
			//console.log("projID:"+projID);	
			if(err)  return callback(err);
			var cursor = db.collection('users');
				
				  //--开始数据库操作
			     switch(true)  
			     {
			     case x==0:
			    	      //console.log('11');
			    		var objID= new ObjectID(val);
			            cursor.findOne({'_id' : objID  } , function(err,doc){
							if(err) callback(err);	else callback(err,doc);  	
						 });  
			    	 break;
			    
			     case x==1: 
			    	 cursor.findOne({'userid' : val  } , function(err,doc){
							if(err) callback(err);
							    else callback(err,doc);  	
						 });  
			    	 break;
			    	 
			     case x==2:  
			    	 cursor.findOne({'name' : val ,'cancelstatus':1  } , function(err,doc){
							if(err) callback(err);
							    else callback(err,doc);  	
						 });  
			          break;
					  
			     } //-switch end

	      });  //--mongodb.open end!
	    
	}   //User.FindForLogin_X   end



	 
	
// designer文档的数据库操作,END!  -->






































