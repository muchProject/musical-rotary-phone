//console.log("11");
var config = require('./config');
//console.log("22");

var mongodb = require('mongodb');
//console.log(mongodb);

var Db = require('mongodb').Db;
//console.log(Db);
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server(config.host,config.port,{});;

module.exports = new Db(config.db, Server);

/*
	  var MongoClient = require('mongodb').MongoClient
	    , format = require('util').format;    

	  MongoClient.connect('mongodb://127.0.0.1:27017/mx', function(err, db) {
	    if(err)  {throw err; console.log("11");}
	      var collection = db.collection('project');
	      collection.insert({projid: '',name:req.body['inputpro'],desc:req.body['inputdes'], desid:''}, {w:1}, function(err, objects) {
	    	
	    	//console.log("22");
	      if (err) { console.warn(err.message);console.log("33");  }  
	      
	      
	      if (err && err.message.indexOf('E11000 ') !== -1) {
	        // this _id was already inserted in the database
	          console.log("666");  
	      }
	      
	      db.close();
	        
	    });
	    
*/
