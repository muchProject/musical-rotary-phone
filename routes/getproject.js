//console.log('getProject')
var assert=require('assert');
var mongodb = require('./db');
var async = require('async');
var EventProxy =   require('eventproxy');
var User=require('./user');
var Promise = require('promise');
var getProject=require('./getproject');

function getProject(resu) {
		this.resu = resu;
	};	
	
module.exports = getProject;

//---project  文档的数据库操作.
		
// 1.get Project	
	   

getProject.Getprj = function Getprj(callback){

	mongodb.open(function(err,db){
		if(err) {return callback(err);}
	    	
			var cursor_prj =db.collection('project').find( {'cancelstatus' : 1} );
		    assert.equal(err,null);
		    var cursor_admin_coll=db.collection('admuser');
		    assert.equal(err,null); 

			var n=0, t=0,  reu=null, alldoc='';
			//--project to array
			cursor_prj.toArray(function(err,docprj){
				if(docprj.length==0) {reu="<h3>没有搜索到，请添加！</h3>";callback(err,reu);}
				else
					{
		
					//console.log(docprj.length);

					async.eachSeries(docprj,function(prjvalue,callback){
					    
						var ep =new EventProxy();
						n++;		
						var prjlistn='prjlist'+n  ,  adminlistn='adminlist'+n ,    userlistn='userlist' +n ,   modulelistn= 'modulelist'+n ;
						var prjtmp='', admtmp='', usertmp='', moduletmp='';	
						
						ep.all(prjlistn  , adminlistn ,  userlistn  , modulelistn   ,function(prjlist, adminlist, userlist , modulelist){ 
							
							alldoc = alldoc + prjlist;
							
							alldoc = alldoc + "<tr class=\'success\'><td>管理账户：</td><td> " +  adminlist +    "</td><td><a href=\'/addaccountAdm?sid="+ prjvalue._id +  "\' style=\'color: #3366FF\'> + 添加</a></td></tr>";	
							alldoc = alldoc + "<tr class=\'info\'><td>用户：</td><td>"+ userlist + "</td><td><a href=\'/addaccountUser?sid="+  prjvalue._id +  "\'  style=\'color: #3366FF\'> + 添加</a><br><a href='/addOtherPrj?sid="+ prjvalue._id  + "' > +加载其它项目用户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a> </td></tr>";
							
							alldoc = alldoc +  "<tr class=\'warning\'><td>功能模块：</td><td>" + modulelist + " </td><td><a href='/addmod?sid="+  prjvalue._id +  " ' style='color: #3366FF'> + 添加</a></td></tr>"   ;
							
							alldoc = alldoc + "<tr class=\'\'><td>描述：</td><td>"+ prjvalue.desc +  " </td><td></td></tr></tbody></table></div></div></div><hr>";
						// console.log('Event Proxy-----PrjID:' + prjvalue.projid );
							 
						return 	callback(); 
						});  //--ep.all end
					   //  ep.emit('prjlist', prjtmp);	
					  // ep.emit('adminlist', admtmp);	
					    // ep.emit('userlist', usertmp);	
					   
						
					   //  console.log('PrjID:' + prjvalue.projid );
						
					     //4.功能模块List， 触发，ep.all
						    ep.all( userlistn, function(adminlist){
						    	getProject.getmodulelist( prjvalue.projid , function(resul){
										 // console.log(resul);
										   ep.emit( modulelistn , resul);			   
									   });  
						    });
					     
		 
						//--3.用户List，  触发：4.功能模块List
					    ep.all(adminlistn, function(modulelist){
					    	getProject.getuserprojectlist( prjvalue.projid , function(resul){
									 // console.log(resul);
									   ep.emit( userlistn, resul);			   
								   });  
					    });
	 
						//--2. 管理账户List， 触发：3.用户List
					    
	                      //console.log('1Pid:' + prjvalue.projid );
					 ep.all(prjlistn, function(prjlist){				 
						 getProject.getadmlist( prjvalue.projid , function(resul){
							  //console.log(resul);
							   ep.emit(adminlistn, resul);			   
						   });  
					 });
					 
					 
					 //1.project list, 触发：2管理账户List
					  prjtmp= prjtmp + " <div class=\\'container-fluid\'><div class=\'row-fluid\'><div class=\'span12\'><p class=\'table-striped\'></p><table class=\'table table-striped\'>";
					  prjtmp= prjtmp + "<thead><tr><th>项目"+ n + "："+ prjvalue.name +  " &nbsp;&nbsp;&nbsp;&nbsp; <br />端口:"+ prjvalue.port +  " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th><th><a  target = '_blank' href='/' style='color: #3366FF'> >>入口   </a> </th><th><a href='/cancelprj?sid="+ prjvalue._id +  "  ' style='color: #3366FF'>-注销&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a></th></tr></thead><tbody><tr><td></td><td></td><td></td></tr>";
					  ep.emit(prjlistn, prjtmp);
					 
	    
					}, function(err) {
					 if(err==null)  callback(err,alldoc);
						});
					
					}  //--if end
				
			});
	    	


	});  //--mongodb.open end!
	    
	
}   //--getProject function end!
	
		

//---2

getProject.Getcollections = function Getcollections(callback){
	
	mongodb.open(function(err,db){
	if(err) {console.log(err);}
	//console.log('11');
	 var reu='';
		db.collections(function(err,doc) {
			if(err) {console.log(err);}
	
			for(x in doc)
				{
				reu = reu + " <li><a href=''>" +  doc[x].collectionName + " </a></li>  ";
				//console.log(doc[x].collectionName)
				}
			
			callback(err,reu);  
			}); //--db.collections end!
	    }); //--mongodb.open end!
	}     //--getproject.Getcollections   end





getProject.getadmlist =  function getadmlist(projid ,callback)
{  var resul= '', resulnull=null;
	 var async_admin = require('async');
	 var ad=0, admclass='';
	// console.log('Pid:' + projid );
	
   mongodb.open(function(err,db){
   assert.equal(err,null);
	 
	 var cursor_admin= db.collection('admuser').find({'projid':projid , 'cancelstatus':1  });
	  assert.equal(err,null);
	 
	 cursor_admin.toArray(function(err,docadm){
	    	//console.log(docadm);
	    	if(docadm.length == 0)   return callback(resulnull);
	    	else
	    	{    //console.log('222');
	    		async_admin.eachSeries(docadm, function(admvalue, callback){
			    	   ad++;
			    	   admclass='adm'+admvalue.auid;
			    	   resul =  resul + "<div  class=\'" + admclass + "\' >" + ad +":" + admvalue.name +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <a onclick=\'canceladm(" + admvalue.auid + ")\'  > -注销 </a> </div>";
			    	  // console.log(ad+":"+ admvalue.name);
			    	   callback(); 
	    		  },  function(err) {   return callback(resul); });   //-- async.eachSeries  end
		   }  //--if end
	    	
      }); //cursor_admin.toArray
	 
   });  //db open end

}   //--function end 




getProject.getuserprojectlist =  function getuserprojectlist(projid ,callback)
{  var resulnull= null,  resul='';
var User=require('./user');
  var async_user = require('async');
 
  mongodb.open(function(err,db){
	    assert.equal(err,null);
  
    var cursor_user = db.collection('userproject').find({'projid':projid, 'cancelstatus':1});
    assert.equal(err,null);
   // mongodb.close();
    var upn =0;
    cursor_user.toArray(function(err,docuser){
   	if(docuser.length == 0)  return callback(resulnull);
   	else
   		{
   		   async_user.eachSeries(docuser, function(uservalue,callback){
   			   upn++;
   			   User.UserFindOne_X(1, uservalue.projid , uservalue.userid , function(err,userresult){
   				 User.usermodule(uservalue.projid , uservalue.userid,function(err,modresult) {
   					//console.log(uservalue.projid); console.log(uservalue.userid); console.log(userresult);
   					if(userresult!=null )
   						{
   					    var  usersclass ='usersclass'+userresult.userid;
 				         resul=  resul+  "<div  class=\'" + usersclass + "\' >" + upn  +"."  +  userresult.name     + "(" +  modresult  + ") "+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br>  <a href=\'/updateUserModule?sid="+ userresult._id +  "&prjid="+ uservalue.projid+"\'>更改</a> &nbsp; &nbsp;  <a onclick=\"cancelusers('" + uservalue._id + "' ,  " + userresult.userid  + ")\"  > -注销 </a> </div>";
   						}
   					 // console.log( upn  +"."  +  userresult.name ); b  
   				   callback();
   				   });  //-- User.usermodule end
   				 });  // User.UserFindOne_X

   		   }, function(err) { return callback(resul);   });  //async.eachSeries  end
   		}  //--if end
   	
   });  //--cursor_user.toArray end
    
  });  //db open end
    
	 
}   //--function end 




getProject.getmodulelist =  function getmodulelist(projid ,callback)
{  var resultnull=null, resul= '';
var module=require('./module');
  var async_mod = require('async');
 
  mongodb.open(function(err,db){
	    assert.equal(err,null);
  
    var cursor_mod = db.collection('module').find({'projid':projid, 'cancelstatus':1});
    assert.equal(err,null);
   // mongodb.close();
    var upn =0, modflg='';
    cursor_mod.toArray(function(err,docmod){
    	//console.log(docmod.length);
    	
  	if(docmod.length == 0)  return callback(resultnull);
   	else
   		{
   		   async_mod.eachSeries(docmod, function(modvalue,callback){
   		   upn++; modflg='mod'+modvalue.modid;
   		   resul=  resul  +   "<div class=\'"+modflg+"\'>代码:" + modvalue.modid + "," +  modvalue.name +"--"  +  modvalue.jsname + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <a onclick=\'cancelmod(" + modvalue.modid + ")\'  > -注销 </a></div>";	   
   				  // console.log( upn  +"."  +  userresult.name );
   		   callback();
   		   }, function(err) { return callback(resul);   });  //async.eachSeries  end
      }  //--if end
   	
   });  //--cursor_user.toArray end
    
  });  //db open end
    
}   //--function end 















	
// designer文档的数据库操作,END!  -->






































