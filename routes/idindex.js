//console.log('idindex')
var mongodb = require('./db.js');

//console.log('11')

function Idindex(idindex) {
		this.projid = idindex.projid ;
	    this.desid =  idindex.desid ;
		this.desid =  idindex.desid ;
		this.auid = idindex.auid ;
		this.userid =  idindex.userid;
		this.modid =  idindex.modid;
	};	
	
module.exports = Idindex;

//---designer  文档的数据库操作.
		
// 1.findone
	    
Idindex.idfindone = function idfindone(callback){
	mongodb.open(function(err,db){
		 if(err) {return callback(err);}   
		 db.collection('idindex',function(err,collection){
			 if(err) {return callback(err);}
				
			 //--开始查找数据库	
			      // var tmp = new Idindex({});
			       collection.findOne(function(err,doc){
		    		      if(err) {
			    			    return callback(err);
			    		   } else {		
			    			    callback(err,doc);
			    		   }
				     });  //collection.findone end!
				 
		});  //--db.collection end!	
	});  //--mongodb.open end!
}   //--designerfindone function end!
	   
Idindex.idfindonenV2 = function idfindonenV2(callback){
	mongodb.open(function(err,db){
		 if(err) {return callback(err);}   
		 db.collection('idindex',function(err,collection){
			 if(err) {return callback(err);}
				
			 //--开始查找数据库	
			       var tmperr = 'Erro:Idindex findon return null.';
			       collection.findOne(function(err,doc){
		    		      if(err) {
			    			    return callback(err);
			    		   } else {	
			    			      if(doc == null) 
			    			         {callback(tmperr);}
			    			     else
			    			         {callback(err,doc);}
			    		   }  //ifend
				     });  //collection.findone end!
				 
		});  //--db.collection end!	
	});  //--mongodb.open end!
}   //--designerfindone function end!

// DesId++  数据自增1 

Idindex.desidAdd = function desidAdd(callback) {
	mongodb.open(function(err,db){
		if(err) { return callback(err);}  
		db.collection('idindex',function(err,collection){
			if(err) { return callback(err);}  
			
			//--开始查找数据库
			collection.findOne(function(err,doc){
			    var tmp = new Idindex({});
				if(err ) { return callback(err);} 

				if(doc) {
					         tmp=doc;
					         tmp.desid=doc.desid +1;
							 collection.update({projid:tmp.projid},{$set:{desid:tmp.desid}},{w:1}, function(err,ressu) {    
							       if (err){return callback(err);}   else {callback(err,ressu);console.log('Idindex successfully updated'); }
		                      });  //--collection.update end!
				 } else {
						      callback(err,doc);
				}  //-- if end!
	        }); //--collection.findOne end!

		});  //--db.collection end!	
	});  //--mongodb.open end!
} //--desidAdd function end!
		
//指定Id++  数据自增1 

Idindex.IdAdd = function IdAdd(x, callback) {
	mongodb.open(function(err,db){
		if(err) { return callback(err);}  
		db.collection('idindex',function(err,collection){
			if(err) { return callback(err);}  
			
				//--开始查找数据库
				collection.findOne(function(err,doc){
				   // var tmp = new Idindex({});
					if(err ) { return callback(err);} 

					if(doc==null)
					{   
					    return  callback(tmperr);
					 } else {
 
						   switch (x)      //1:projid  2:desid 3:auid 4:userid  5:modid
						   {
						   case 1: 
							   nullerro='Error:projid ++1 return null.';
							   collection.update({projid:doc.projid},{$set:{projid: doc.projid+1}},{w:1}, function(err,ressu) {    
						            if(ressu == null) {callback(nullerro);} else  {mongodb.close(); callback(err,ressu);console.log('Idindex successfully updated'); }
		                        });  
							   break;
							   
						   case 2:
							   nullerro='Error:desid ++1 return null.';
							   collection.update({projid:doc.projid},{$set:{desid: doc.desid+1}},{w:1}, function(err,ressu) {    
						            if(ressu == null) {callback(nullerro);} else  {mongodb.close(); callback(err,ressu);console.log('Idindex successfully updated'); }
		                        });  							   
							   break;
							   
						   case 3:
							   nullerro='Error:auid ++1 return null.';
							   collection.update({projid:doc.projid},{$set:{auid: doc.auid+1}},{w:1}, function(err,ressu) {    
						            if(ressu == null) {callback(nullerro);} else  { mongodb.close();  callback(err,ressu);console.log('Idindex successfully updated'); }
		                        });  
							   break;
							   
						   case 4:
							   nullerro='Error:userid ++1 return null.';
							   collection.update({projid:doc.projid},{$set:{userid: doc.userid+1}},{w:1}, function(err,ressu) {    
						            if(ressu == null) {callback(nullerro);} else  { mongodb.close(); callback(err,ressu);console.log('Idindex successfully updated'); }
		                        });  
							   break;
						      
						   case 5:
							   nullerro='Error:modid ++1 return null.';
							   collection.update({projid:doc.projid},{$set:{modid: doc.modid+1}},{w:1}, function(err,ressu) {    
						            if(ressu == null) {callback(nullerro);} else  {mongodb.close();  callback(err,ressu);console.log('Idindex successfully updated'); }
		                        });  
						       break;
						   }   //-switch  end

					}  //-- if end!
		        }); //--collection.findOne end!
		});  //--db.collection end!	
	});  //--mongodb.open end!
}  //function end





// designer文档的数据库操作,END!  -->

