//console.log('designer')
var mongodb = require('./db.js');

function Designer(designer) {
		this.desid = designer.desid;
	    this.name = designer.name;
		this.passw = designer.passw;
	};	
	
module.exports = Designer;

//---designer  文档的数据库操作.
		
// 1.findone	
	    
Designer.desfindone = function desfindone(desname,callback){
	mongodb.open(function(err,db){
		if(err) {return callback(err);}
		db.collection('designer',function(err,collection){
			if(err) {return callback(err);}
			  
			  //--开始数据库操作
		      // var tmp = new Designer({});
			   collection.findOne({name:desname},function(err,doc){
				if(err) {
					callback(err);
				}	else {
				         callback(err,doc);
				          }		
		    });  //collection.findone end!
			
		});  //--db.collection end!
   });  //--mongodb.open end!
}   //--designerfindone function end!
	
		
		
// 2.insert
 
Designer.desginsert = function desginsert(desg,callback) {
	mongodb.open(function(err,db) {
		if(err) { return callback(err);}  
        db.collection('designer',function(err,collection){
        	if(err) {return callback(err);}
	        
        	//开始数据库操作
        	//var tmp = new Designer({});
    	    //collection.ensureIndex('name',{unique: true});
    	    collection.insert(desg, {safe:true},function(err,doc){ 
    	    	if(err) {
    			  return callback(err);
    			  } else {
				       callback(err,doc);
    			  } 
    	    });  //--collection.insert end!

      });  //--db.collection end!
	});   //--mongodb.open end!
};  //--desginsert function end!

		
	
// designer文档的数据库操作,END!  -->

