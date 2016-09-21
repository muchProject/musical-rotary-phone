//console.log('idindex')
var mongodb = require('./db.js');

//console.log('11')

function sleep(milliSeconds) {  
	var startTime = new Date().getTime();   
	while (new Date().getTime() < startTime + milliSeconds);
	}   



function DBclose(dbdoc) {
       this.dbdoc=dbdoc
	};	
	
module.exports =DBclose;

// 1.指定数据库库连接
	    
DBclose.dbclosed = function dbclosed(){
	mongodb.open(function(err,db){
		 if(err) {console.log('MongoDB链接关闭失败.');}   	
		 db.collection('idindex',function(err,collection){
		
		 //sleep(80);   //等待0.08秒后，关闭数据库连接
		 mongodb.close();
		  	 		 
		});  //--db.collection end!	
	});  //--mongodb.open end!
}   //--designerfindone function end!
	   


