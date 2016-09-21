var express = require('express');
var mongodb = require('./db.js');
	
	function db_mx(mx){	
		this.project = {
				projid: mx.project.projid,
				name: mx.project.name,
				desc: mx.project.desc,
				desgid: mx.project.desgid,
		};	
			
		this.designer = {
				desid: mx.designer.desid,
				name: mx.designer.name,
				passw: mx.designer.passw,
		};
		
		this.admuser = {
				auid: mx.admuser.auid,
				desid: mx.admuser.desid,
				projid: mx.admuser.projid,
				name: mx.admuser.name,
				passw: mx.admuser.passw,
		};

		this.users = {
				userid: mx.users.userid,
				desid: mx.users.desid,
				auid: mx.users.auid,
				name: mx.users.name,
				passw: mx.users.passw,
				projosn: mx.users.projosn,
				modjosn: mx.users.modjosn,
		};

		this.module = {
				modid: mx.module.modid,
				name: mx.module.name,
				jsname: mx.module.jsname,
				desid: mx.module.desid,
				projid: mx.module.projid,
		};  

		this.idindex = {
				projid: mx.idindex.projid ,
				desid: mx.idindex.desid ,
				auid: mx.idindex.auid ,
			    userid: mx.idindex.userid ,
			    modid: mx.idindex.modid ,		
		};	
	}
	
	module.exports = db_mx;


	function Project(project) {
	    this.projid: project.projid,
	    this.name: project.name,
	    this.desc: project.desc,
	    this.desgid: project.desgid,
	}

	
	function Designer(designer) = {
		this.desid: designer.desid,
		this.name: designer.name,
		this.passw: designer.passw,
	};	
	
	
	
	
//---project 文档的数据库操作

	
	// 1. Insert 数据 
	db_mx.prototype.projinsert = function projinsert(callback) {
		var proj = this.project;
		
		mongodb.open(function(err,db) {
          if(err) {return callback(err)}       
		  
          db.collection('project',function(err,collection){
        	  if(err) {mongodb.close();return callback(err);}
        	  
        	  //为name 属性添加索引
        	  //collection.ensureIndex('name',{unique: true});
        	  //写入project文档
        	  collection.insert(proj, {safe:true},function(err,proj){
        		 mongodb.close();
        		 callback(err,proj);       	  
        	  });  //--collection.insert end!

          });  //--db.collection end!
		
		});   //--mongodb.open end!
		
	};  //--projsave function end!
	
	
	//  2. findoneOne 查找一条数据
	
	db_mx.projfindone = function projfindone(projname,callback){
		mongodb.open(function(err,db){
			if(err) {return callback(err);}
		   
			//--连接 project集合
			db.collection('project',function(err,collection){
				if(err) {mongodb.close();return callback(err);}
				
				//查找project文档
				collection.findOne({name:projname},function(err,doc){
					mongodb.close();
					if(doc) {
						//--封装为project对象
						var proj = new Project(doc);
						callback(err,proj);
					} else {
                        callback(err,null);
					}  //--if END!
					
				});  //--collection.findOne END!
				
			});  //--db.collection END!

		});  //--mongodb.open END!
		
	}  //--projfindone END!
	
	
	
// project 文档的数据库操作 ， END!-->
	


//---designer  文档的数据库操作.
	
	
//  1.findone	
    
	db_mx.desfindone = function desfindone(desname,callback){
		mongodb.open(function(err,db){
			if(err) {return callback(err);}
		   
			//--连接 designer集合
			db.collection('project',function(err,collection){
				if(err) {mongodb.close();return callback(err);}
				
				collection.findone({name:desname},function(err,doc){
					mongodb.close();
					if(doc) {
						//--封装为Designer对象
						var desig = new Designer(doc);
						callback(err,desig);
					} else {
                        callback(err,null);
					}  //--if END!

				});  //collection.findone end!
				
			});  //--db.collection end!
			
		});  //--mongodb.open end!
		
	}   //--designerfindone function end!
	
	
	
// 文档的数据库操作,END!  -->

