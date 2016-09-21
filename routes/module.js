//console.log('getProject')
var assert=require('assert');
var mongodb = require('./db.js');
var ObjectID = require('mongodb').ObjectID;
var async = require('async');

function jsmodule(resu) {
   this.modid = resu.modid  ;
   this.name = resu.name  ;
   this.jsname  = resu.jsname   ;
   this.desid   = resu.desid  ;
   this.projid   = resu.projid  ;
   this.cancelstatus = resu.cancelstatus  ;
		
	};	
	
module.exports = jsmodule;

//---project  文档的数据库操作.
		
// 1.FindOne   ,X  0: _id, 1:modid,  2:name  ,  3:jsname  4. name and jsname
//当X=4，val为name, val_2为jsname;  X=1,2,3,  val为对应参数, val_2为任意
	    
jsmodule.jsmoduleFindOne = function jsmoduleFindOne(x, projID, val, val_2 , callback){
	mongodb.open(function(err,db){
		console.log('11');
		console.log("Val:"+val);
		console.log("x:"+x);		
		if(err) {mongodb.close(); return callback(err);}
		
		console.log('11');
		
		db.collection('module',function(err,collection){
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
				
			     collection.findOne({'modid' :  val, 'projid': projID}   , function(err,doc){
						if(err) {callback(err);}	else {mongodb.close();callback(err,doc);}	
					 });   
		    	 break;
		    	 
		     case x==2:
			     collection.findOne({'name'  :  val , 'projid': projID}   , function(err,doc){
						if(err) {callback(err);}	else {mongodb.close();callback(err,doc);}	
					 });  
		    	 break;
		    	 
		     case x==3:
			     collection.findOne({'jsname'  :  val , 'projid': projID}   , function(err,doc){
						if(err) {callback(err);}	else {mongodb.close();callback(err,doc);}	
					 });  
		    	 break;
		    
		    case x==4:
			     collection.findOne({'name' : val ,  'projid': projID}   , function(err,doc){
						if(err) {callback(err);}	else
						{  if(doc==null) {
							    collection.findOne({'jsname'  :  val_2 , 'projid': projID}   , function(err,doc){
							     	if(err) {callback(err);}	else {mongodb.close();callback(err,doc);}
							    });
						   }  else {return callback(err,doc);}
							
						}	
					 });  
		    	 break;
		     
		     case (x!=0 && x!=1 && x!=2  && x!=3 && x!=4 ):
		    	 mongodb.close();
		    	 callback(nullerr);
		    	 break;	 
		     } //-switch end
		     
		});  //--db.collection end!
   });  //--mongodb.open end!
    
}   //Admuser.AdmuserFindOne  end



//2.insert

jsmodule.jsmoduleInsert = function   jsmoduleInsert (newajsmodule,callback) {
	mongodb.open(function(err,db) {
		if(err) {  return callback(err);}  
        db.collection('module',function(err,collection){
        	if(err) {  return callback(err);}
	        
        	//开始数据库操作
        	//var tmperr = 'System Error:project insert failed.';    	
    	   // console.log(newproj);
        	//console.dir(newajsmodule);
        	console.log('11');
        	console.dir(newajsmodule);
    	    collection.insert({modid: newajsmodule.modid  ,   name : newajsmodule.name , jsname : newajsmodule.jsname ,desid: newajsmodule.desid , projid : newajsmodule.projid    ,  cancelstatus : 1 }, function(err,doc){ 
    	    	if(err){
    	    		return callback(err);} 
    	    	else {
				   callback(err,doc);
    		    } 
    	    	
    	    });  //--collection.insert end!

      });  //--db.collection end!
	});   //--mongodb.open end!
}  //--desginsert function end!

	 

jsmodule.Getmodlist= function Getmodlist(prjid,callback){

	mongodb.open(function(err,db){
		if(err) {return callback(err);}
	
		var n=0, t=0, reu=null;
	    var cursor =db.collection('module').find({'projid':prjid, 'cancelstatus':1 });
	    
	    cursor.toArray(function(err, doc) {
	    	
	    	if(doc.length==0)   return  callback(reu);
	    	else
	    		{reu='';
	    		 async.eachSeries(doc, function(value, callback){
			          n++; t++;	
			          var mod_n='mod' + n , modID_n='modID' + n;
			         
			          switch (true)
			          {
			          case t==1:
			             {
				           reu = reu + "<li> ";
				           reu = reu + "<input type=\'checkbox\' id=\'" + mod_n+"\' name=\'" + mod_n +"\'>  ";
				           reu = reu + "<label for=\'square-checkbox-1\'><input   type=\'hidden\'   id=\'" + modID_n +"\' name=\'" + modID_n +"\'  value=\'"+ value.modid +"\'   > "+ value.name + "  </label>  ";
				           if(n==doc.length)   	reu = reu + "</li>  ";	
				           return callback(); 
				           }
			          break;
			          
			          case t==2 :
				          {
					       reu = reu + " <input  type=\'checkbox\'  id=\'" + mod_n +"\'  name=\'" + mod_n +"\' >  ";
					       reu = reu + "<label for=\'square-checkbox-2\'>  <input   type=\'hidden\'   id=\'" + modID_n +"\' name=\'" + modID_n +"\'  value=\'"+ value.modid +"\'   >    "+ value.name + " </label>  ";
					       reu = reu + "</li>  ";	
					       t=0;
					       
					       return callback(); 
					      } 
			          break;  
			          
			          }   //swtich end
			          
	    		   },function(err) {
	    			   if(err)  console.log(err);  
	    			  return 	callback(err,n,reu);});    //async.eachSeries   end
	    		
	    	}  //if end 	
	    });  //---cursor.toArray  end
	    

    });  //--mongodb.open end!    
	
}   //--getProject function end!
	
		
function IsUserModuleExist(prjid,userid, modid,callback) {
	mongodb.open(function(err,db){
		assert.equal(err,null);
		//console.log(prjid + ',' +userid+','+ modid);
		var cursor=db.collection('usermodule').find({'userid':userid, 'projid':prjid ,'modid':modid , 'cancelstatus':1});
		cursor.toArray(function(err,doc){
			if(doc.length == 0)  return callback(0);
			else
				 return callback(1);
		});
		
	});
}

function IsUserModuleExist_v2(prjid,userid, modid,callback) {
	mongodb.open(function(err,db){
		assert.equal(err,null);
		//console.log(prjid + ',' +userid+','+ modid);
		var cursor=db.collection('usermodule').find({'userid':userid, 'projid':prjid ,'modid':modid });
		cursor.toArray(function(err,doc){
			if(doc.length == 0)  return callback(0);
			else
				 return callback(1);
		});
		
	});
}



jsmodule.GetUsermodlist= function GetUsermodlist(prjid,userid,callback){

	mongodb.open(function(err,db){
		if(err) {return callback(err);}
	
		var n=0, t=0, reu=null;
	    var cursor =db.collection('module').find({'projid':prjid, 'cancelstatus':1 });
	    
	    //console.log('prjid:' + prjid + ',userid:'+ userid);
	    
	    cursor.toArray(function(err, doc) {
	    	//console.log(doc);
	    	if(doc.length==0)   return  callback(reu);
	    	else
	    		{reu='';
	    		 async.eachSeries(doc, function(value, callback){
			          n++; t++;	
			          var mod_n='mod' + n , modID_n='modID' + n;
			          var classcheckbox= 'classcheckbox' + value.modid ;
			         //console.log(t);
			          switch (true)
			          {
			        
			          case t==1:
			             {
			        	 // IsUserModuleExist(prjid,userid, modid
				           IsUserModuleExist(prjid,userid, value.modid ,function(flag){
				        	  // console.log('flag:'+flag);
				        	  // console.log('prjid:' + prjid + ',userid:'+ userid +',modid:' + value.modid);
				        	  
				        	   if(flag==0) 
				        		   {
				        		   reu = reu + "<li> ";
						           reu = reu + "<input  class=\'" + classcheckbox + "\'   onclick=\'ajaxUpdateUserModule("+prjid+","+userid+","+value.modid+" )\'  type=\'checkbox\' id=\'" + mod_n+"\' name=\'" + mod_n +"\'>  ";
						           reu = reu + "<label for=\'square-checkbox-1\'><input   type=\'hidden\'   id=\'" + modID_n +"\' name=\'" + modID_n +"\'  value=\'"+ value.modid +"\'   > "+ value.name + " </label>  ";
						           if(n==doc.length)   	reu = reu + "</li>  ";	
						           return callback(); 
				        		   }
				        	   
				        	   else  if(flag==1)
				        		   {
				        		   reu = reu + "<li> ";
						           reu = reu + "<input  class=\'" + classcheckbox + "\'  onclick=\'ajaxUpdateUserModule("+prjid+","+userid+","+value.modid+" )\'     checked  type=\'checkbox\' id=\'" + mod_n+"\' name=\'" + mod_n +"\'>  ";
						           reu = reu + "<label for=\'square-checkbox-1\'><input   type=\'hidden\'   id=\'" + modID_n +"\' name=\'" + modID_n +"\'  value=\'"+ value.modid +"\'   > "+ value.name + " </label>  ";
						           if(n==doc.length)   	reu = reu + "</li>  ";	
						           
						           return callback(); 
				        		   }
				        	   
				           }); //IsUserModuleExist end

				           
				           }
			          break;
			          
			          case t==2 :
				          {
			        	  
			        	  IsUserModuleExist(prjid,userid, value.modid ,function(flag){
				        	   if(flag==0) 
				        		   {
							       reu = reu + "<input class=\'" + classcheckbox + "\'  onclick=\'ajaxUpdateUserModule("+prjid+","+userid+","+value.modid+" )\'    type=\'checkbox\'  id=\'" + mod_n +"\'  name=\'" + mod_n +"\' >  ";
							       reu = reu + "<label for=\'square-checkbox-2\'>  <input   type=\'hidden\'   id=\'" + modID_n +"\' name=\'" + modID_n +"\'  value=\'"+ value.modid +"\'   >    "+ value.name + " </label>  ";
							       reu = reu + "</li>  ";	
							       t=0;
							       
							       return callback(); 
				        		   }
				        	   
				        	   else  if(flag==1)
				        		   {
							       reu = reu + "<input  class=\'" + classcheckbox + "\'  onclick=\'ajaxUpdateUserModule("+prjid+","+userid+","+value.modid+" )\'   checked  type=\'checkbox\'  id=\'" + mod_n +"\'  name=\'" + mod_n +"\' >  ";
							       reu = reu + "<label for=\'square-checkbox-2\'>  <input   type=\'hidden\'   id=\'" + modID_n +"\' name=\'" + modID_n +"\'  value=\'"+ value.modid +"\'   >    "+ value.name + " </label>  ";
							       reu = reu + "</li>  ";	
							       t=0;
							       return callback(); 
				        		   }
				        	   
				             }); //IsUserModuleExist end
				         

					      } 
			          break;  
			          
			          }   //swtich end
			          
	    		   },function(err) {
	    			   if(err)  console.log(err);  
	    			  return 	callback(err,n,reu);});    //async.eachSeries   end
	    		
	    	}  //if end 	
	    });  //---cursor.toArray  end
	    

    });  //--mongodb.open end!    
	
}   //--getProject function end!
	
		





//cancel   val: 1: _id, 2:auid,  3.name  , 4.jsname


jsmodule.cancelMod = function cancelMod(x,  val, prjid, callback) {
	mongodb.open(function(err,db){	
		if(err) return callback(err);
		var cursor=db.collection('module');

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
			//console.log(val);
		     cursor.update({modid: val}, {$set: { cancelstatus : 0 }}, {w:1}, function(err) {
			      if (err) return callback(err);
			      else return callback(err,true);
			    });
			break;
			
		case x==3 :
			cursor.update({projid:prjid,  name:val}, {$set: {cancelstatus:0}}, {w:1}, function(err) {
				if(err) return callback(err);
				else return callback(err,true);
			});
			break;
		
		case  x==4 :
			//console.log(val);
		     cursor.update({jsname: val}, {$set: { cancelstatus : 0 }}, {w:1}, function(err) {
			      if (err) return callback(err);
			      else return callback(err,true);
			    });
			break;		
		
		}

	});	
	
}



//cancel x: 0:_id  , 1:userid,modid,projid
jsmodule.cancelUserMod= function cancelUserMod(x,  val, prjid, modid, callback) 
{
	mongodb.open(function(err,db){	
		if(err) return callback(err);
		var cursor=db.collection('usermodule');

		switch (true) 
		{
		case  x==0 :
			var objID= new ObjectID(val);
		     cursor.update({_id: objID}, {$set: { cancelstatus : 0} }, {w:1}, function(err) {
		      if (err) return callback(err);
		      else return callback(err,true);
		    });
		   break;
		
		case  x==1 :
			//console.log(val);
		     cursor.update({'userid': val  , 'projid': prjid  , 'modid': modid}, {$set: { cancelstatus : 0 }}, {w:1}, function(err) {
			      if (err) return callback(err);
			      else return callback(err,true);
			    });
			break;

		}  //switch

	});	// mongodb open end
}

//cancel x: 0:_id  , 1:userid,modid,projid
jsmodule.addUserMod = function updateUserMod(x,  val, prjid, modid, callback) 
{ 
	//console.log(val);console.log(prjid); console.log(modid);
	
	mongodb.open(function(err,db){	
		if(err) return callback(err);
		var cursor=db.collection('usermodule');

		switch (true) 
		{
		case  x==0 :     
			var objID= new ObjectID(val);
		     cursor.update({_id: objID}, {$set: { cancelstatus : 1} }, {w:1}, function(err) {
		      if (err) return callback(err);
		      else return callback(err,true);
		    });
		   break;
		
		case  x==1 :
			 IsUserModuleExist_v2(prjid,val, modid ,function(flag){
				// console.log('flag:'+ flag);
	        	   if(flag==0)    //不存在， 则insert
	        		   {
	        		      cursor.insert({'userid': val , 'modid': modid , 'projid' : prjid   ,  cancelstatus : 1 }, function(err,doc){ 
		     			      if (err) return callback(err);
		     			      else return callback(err,true);
	        		       });
	        		   }
	        	   
	        	   else  if(flag==1)   //存在，则update
	        		   {
	      		          cursor.update({'userid': val  , 'projid': prjid  , 'modid': modid}, {$set: { cancelstatus : 1 }}, {w:1}, function(err) {
	   			              if (err) return callback(err);
	   			              else return callback(err,true);
	   			           });
	        		   }
	        	   
	             }); //IsUserModuleExist end
		
			break;

		}  //switch

	});	// mongodb open end
	
}

	
// designer文档的数据库操作,END!  -->






































