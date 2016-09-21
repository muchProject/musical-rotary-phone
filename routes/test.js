var assert=require('assert');
var async = require('async');

var EventProxy =   require('eventproxy');
var User=require('./user');
var Promise = require('promise');
var getProject=require('./getproject');

var mongodb = require('./db.js');
var ObjectID = require('mongodb').ObjectID;

function sleep(milliSeconds) { 
    var startTime = new Date().getTime(); 
    while (new Date().getTime() < startTime + milliSeconds);
 };
 //sleep(10000);  等待10秒。
 
// console.log('aaa');
// sleep(3000);
 //console.log('bbb');
 
 //去除空格
 var reu="  ab   c    ";
 console.log("|"+reu+"|");
 reu1 =reu.trim();  //去除两边
 console.log("|"+reu1+"|");
 
 var reu1=reu.replace(/^\s+/g,""); //去除左边
 console.log("|"+reu1+"|");
 
 var reu2=reu.replace(/\s+$/g,"");  //去除右边
 console.log("|"+reu2+"|");
 var reu3=reu.replace(/\s+/g, '');  //去除所有空格
 console.log("|"+reu3+"|");
 
 
 var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '123456',
   database : 'zhengquan'
 });
 
 var Users = require('./user');
 
 
 var prjID = 220;
	console.log('cancel  cancelusersAll  All:' + prjID );
	//var Users = require('./user');
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('userproject').find({'projid':prjID});
		cursor.toArray(function(err,doc){
			//console.log(doc);
			if(doc.length!=0) {
				async.eachSeries(doc,function(value,callback){
					console.log(value);
					Users.IsUserInOtherPrj(prjID , value.userid ,  function(isFlag) {
			    		console.log("flag:" + isFlag);
			    		if(isFlag==0)   //如果此User不存在于其它项目（flag=0），则注销此用户	
			    			{
			    			Users.cancelUser(2,value.userid ,'',function(err){
			    				  console.log('User  cancel OK: ' + value.userid );
			    				   return callback();
			    			   });
			    			}	else return callback();
			    				
			    	});   //Users.IsUserInOtherPrj  end
					
				}, function(err){ 
					if(err) console.log('User Cancel failed!');
					else 
				       console.log('User Cancel successed!');
				});
			}
			
		});  // cursor.toArray end
	}); 
		
 
	mongodb.open(function(err,db){
		assert.equal(err,null);
		var cursor=db.collection('userproject').find({'userid':40, 'projid':{$ne:18} , 'cancelstatus':1});
		cursor.toArray(function(err,doc){
			if(doc.length == 0)  console.log('不存在');
			else
				 console.log('存在');
		});
		
	});
 
 
 /*  
 mongodb.open(function(err,db){
		if(err) callback(err);
		var cursor=db.collection('usermodule');
		var projid=19 , userid=41;
		cursor.update( {'projid': projid  ,'userid': userid}, {$set:{cancelstatus:0}},  {multi:true} , function(err,doc) {
			console.log(doc);  
			//if (err) return callback(err);
            //   else return callback(true);
        });
		
 });
 */
 
 
 

 //connection.connect();

// connection.query('SELECT * FROM `books` WHERE `author` = "David"', function (error, results, fields) {
	  // error will be an Error if one occurred during the query
	  // results will contain the results of the query
	  // fields will contain information about the returned results fields (if any)
//	});
 
 
 
// connection.query('SELECT * FROM `gupiao`  where 1', function(err, results, fields) {
 //  if (err) throw err;
 //  console.log(results);
 //  console.log(fields);
   //console.log('The solution is: ', rows[0].solution);
 //});

 //connection.end();
 
 
 
 function IsModuleExist(modid,callback) {
		mongodb.open(function(err,db){
			assert.equal(err,null);
			var cursor=db.collection('module').find({'modid':modid , 'cancelstatus':1});
			cursor.toArray(function(err,doc){
				if(doc.length == 0)  return callback(false);
				else
					 return callback(true);
			});
			
		});

	}

	 
	function upload() { 
	  console.log("Request handler 'upload' was called."); 
	  return "Hello Upload"; 
	} 
 
 //ar kk=upload();
 
 //console.log('flag:'+kk);
 
	//结果不成功，  return 不能再mongodb.open(function(err,db){})  中使用
IsModuleExist(2,function(flag){
	 console.log('flag:' + flag)
});

 
 //if(IsModuleExist(2) == 1 ) console.log('11111');
 //else console.log('00000');
 


/*
 * 
 * 
 * <html>
<head>
<script src="/jquery/jquery-1.11.1.min.js">
</script>
<script>
$(document).ready(function(){
});

function add(id)
{
var tmp='';

tmp= tmp + " <tr  id='tr_SheetTmp"+id+"' >  ";
tmp= tmp + "   <td colspan='5' align='right'>  ";
tmp= tmp + " <table id='tb_SheetTmp"+id+"' frame='hsides'   > ";
tmp= tmp + " <td colspan='5' align='right'> ";

tmp= tmp + " <div>   ";
tmp= tmp + " <input id='nameTmp56' type='text'  style='width:70px;' placeholder='  兴业银行' disabled   />&nbsp;&nbsp; ";
tmp= tmp + " <input id='priceTmp56' type='text'  style='width:70px;' placeholder='交易价格' required autofocus  />&nbsp;&nbsp;&nbsp; ";
tmp= tmp + " <input id='countTmp56' type='text'  style='width:60px;' placeholder='数量' required autofocus  />&nbsp;&nbsp;&nbsp; ";

tmp= tmp + "<a class='button button-primary button-rounded button-small' onclick='AjaxBuy(56)'>买入</a>&nbsp;";
tmp= tmp + "<a class='button button-primary button-rounded button-small' onclick='AjaxBuy(56)'>卖出</a>";

tmp= tmp + " </div></td> ";


tmp= tmp + "<tr><td></td><td></td><td></td><td></td><td></td> </tr>  ";
tmp= tmp + " </table> ";
tmp= tmp + "        ";
tmp= tmp + "  </td>  ";
tmp= tmp + " </tr>  ";



var flag=$("input#jiaoyi"+id).val();
//alert(flag);

if(flag==0) 
{
$("input#jiaoyi"+id).val(1);
$("tr#tr_gupiaoSheet"+id).after(tmp); 
$("a#jiaoyi"+id).text('返回'); 
}
if(flag==1) 
{$("input#jiaoyi"+id).val(0); 
$("tr#tr_SheetTmp"+id).remove();
$("a#jiaoyi"+id).text('交易'); 
}


}

</script>
</head>

<body>

<table id='table_gupiaoBlance' border="0" name= '' class="table table-hover">
<thead><tr class='info'>
<th >总资产： 0   (人民币)</th>
<th></th>
<th></th>
<th></th>
<th></th>
</tr></thead>
<tbody>

<tr  class='success'>
<td>股票/代码</td>
<td>持仓;</td>
<td>现价</td>
<td>盈亏</td>
<td></td>
</tr>


<tr id='tr_gupiaoSheet56'   class='success'> 
<td>兴业银行 <br>601166 </td>
<td>0</td>
<td>16.03</td>
<td>0</td>
<td><a>明细</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <a id='jiaoyi56'   onclick='add(56)'  >交易</a><input type='hidden' id='jiaoyi56' value='0' ></td>
</tr> 

<tr id='tr_gupiaoSheet57'  class='success'> 
<td>贵州茅台 <br>600519 </td>
<td>0</td>
<td>250</td>
<td>0</td>
<td><a>明细</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <a>交易</a></td>
</tr>

<tr id='tr_gupiaoSheet59'  class='success'> 
<td>福耀玻璃 <br>600660 </td>
<td>0</td>
<td>13.9</td>
<td>0</td>
<td><a>明细</a> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  <a>交易</a></td>
</tr>
</tbody>



</table>







<h4>横跨两列的单元格：</h4>
<table border="1">
<tr id='ttt' ondblclick='add()'>
  <th>姓名</th>
  <th colspan="2">电话</th>
</tr>

<tr>
  <td>11111</td>
  <td >22222</td>
<td >333333</td>
</tr>

</table>

<h4>横跨两行的单元格：</h4>
<table border="1">
<tr>
  <th>姓名</th>
  <td>Bill Gates</td>
</tr>
<tr>
  <th rowspan="2">电话</th>
  <td>555 77 854</td>
</tr>
<tr>
  <td>555 77 855</td>
</tr>
</table>

</body>
</html>

 * 
 * 
 * 
 */

 
 /**
  * 
  * <html>
<head>
<script type="text/javascript" src="/jquery/jquery.js"></script>
<script type="text/javascript">
$(document).ready(function(){
  $("input#aa").focus(function(){
    $("input#aa").css("background-color","#FFFFCC");
  });
  $("input#aa").blur(function(){
    $("input#aa").css("background-color","#D6D6FF");
  });

 $("input#bb").focus(function(){
    $("input#bb").css("background-color","#FFFFCC");
  });

 $("td#tdcalssname").dblclick(function(){
    $("div#gupiaoname").hide();
    $("input#hidd").show().focus();;
  });

 $("input#hidd").blur(function(){
    var str=$("input#hidd").val();
    $("div#gupiaoname").text(str);
    $("div#gupiaoname").show();
    $("input#hidd").hide();
  });


});
</script>
</head>
<body>

Enter your name: <input id='aa' type="text" />   <input id='bb' type="text" />

<table id='table_gupiao' name= '' class="table table-hover">
<thead><tr>
<th>股票信息</th>
<th></th>
<th></th>
<th></th>
</tr></thead>
<tbody>
<tr>
<td>股票</td>
<td>代码</td>
<td>股价</td>
<td>操作</td>
</tr>
<tr id='tr_gupiao56' class='success'> <input type='hidden' id='hid_gupiao56'  value='56' >
<td id='tdcalssname'><div id='gupiaoname'>兴业银行</div>  <input id='hidd' type="text" value='兴业银行' style="display: none; width:100px;"  /></td>
<td>601166 </td>
<td>16.03 </td>
<td><a>修改</a>  <a onclick='AjaxCancelGupiao(56)'>注销</a></td> 
</tr>
<!--<tr class="success">-->
<!--<td>华域汽车 </td>-->
<!--<td>601166</td>-->
<!--<td>13.3</td>-->
<!--<td><a>修改</a>  <a>注销</a></td>-->
<!--</tr>-->
</tbody>
</table>

<p>请在上面的输入域中点击，使其获得焦点，然后在输入域外面点击，使其失去焦点。</p>
</body>
</html>

  * 
  * 
  * 
  */
 
 
 
 
 
 
 
 
 
 
 
 
 /*
	mongodb.open(function(err,db){	
		if(err) return callback(err);
		var val = 6
		//var  cursor = db.collection('admuser');
			    
		db.collection('admuser').update({auid: val}, {$set: { cancelstatus : 0 }}, {w:1}, function(err) {
		          if (err) console.log(err);
		          else  {console.log('注销成功');  }
		       });
	


   // var val='test',  projID = 11 ;
	mongodb.open(function(err,db){
		if(err) {console.log(err);}
		

		var cursor_prj =db.collection('project').find( {'cancelstatus' : 1} );
	    assert.equal(err,null);
	    var cursor_admin_coll=db.collection('admuser');
	    assert.equal(err,null); 

		var n=0, t=0,  reu=null, alldoc=null;
		//--project to array
		cursor_prj.toArray(function(err,docprj){
			if(docprj.length==0)  {console.log('Project NULL');}
			else
				{
	
				//console.log(docprj.length);

				async.eachSeries(docprj,function(prjvalue,callback){
				    
					var ep =new EventProxy();
					n++;		
					var prjlistn='prjlist'+n  ,  adminlistn='adminlist'+n ,    userlistn='userlist' +n ,   modulelistn= 'modulelist'+n ;
					var prjtmp=null, admtmp=null, usertmp=null, moduletmp=null;	
					
					ep.all(prjlistn  , adminlistn ,  userlistn  , modulelistn   ,function(prjlist, adminlist, userlist , modulelist){ 
						
						alldoc = alldoc + prjlist;
						
						alldoc = alldoc + "<tr class=\'success\'><td>管理账户：</td><td> " +  adminlist +    "</td><td><a href=\'http://localhost:3008/addaccountAdm?sid="+ prjvalue._id +  "\' style=\'color: #3366FF\'> + 添加</a></td></tr>";	
						alldoc = alldoc + "<tr class=\'info\'><td>用户：</td><td>"+ userlist + "</td><td><a href=\'http://localhost:3008/addaccountUser?sid="+  prjvalue._id +  "\'  style=\'color: #3366FF\'> + 添加</a></td></tr>";
						
						alldoc = alldoc +  "<tr class=\'warning\'><td>功能模块：</td><td>" + modulelist + " </td><td><a href='http://localhost:3008/addmod?sid="+  prjvalue._id +  " ' style='color: #3366FF'> + 添加</a></td></tr>"   ;
						
						 console.log('Event Proxy-----PrjID:' + prjvalue.projid );
						 
					return 	callback(); 
					});  //--ep.all end
				   //  ep.emit('prjlist', prjtmp);	
				  // ep.emit('adminlist', admtmp);	
				    // ep.emit('userlist', usertmp);	
				   
					
				     console.log('PrjID:' + prjvalue.projid );
					
				     //4.功能模块List， 触发，ep.all
					    ep.all( userlistn, function(adminlist){
					    	getProject.getmodulelist( prjvalue.projid , function(resul){
									  console.log(resul);
									   ep.emit( modulelistn , resul);			   
								   });  
					    });
				     
	 
					//--3.用户List，  触发：4.功能模块List
				    ep.all(adminlistn, function(modulelist){
				    	getProject.getuserprojectlist( prjvalue.projid , function(resul){
								  console.log(resul);
								   ep.emit( userlistn, resul);			   
							   });  
				    });
 
					//--2. 管理账户List， 触发：3.用户List
				    
                      //console.log('1Pid:' + prjvalue.projid );
				 ep.all(prjlistn, function(prjlist){				 
					 getProject.getadmlist( prjvalue.projid , function(resul){
						  console.log(resul);
						   ep.emit(adminlistn, resul);			   
					   });  
				 });
				 
				 
				 //1.project list, 触发：2管理账户List
				  prjtmp= prjtmp + " <div class=\\'container-fluid\'><div class=\'row-fluid\'><div class=\'span12\'><p class=\'table-striped\'></p><table class=\'table table-striped\'>";
				  prjtmp= prjtmp + "<thead><tr><th>项目"+ n + "："+ prjvalue.name +  " &nbsp;&nbsp;&nbsp;&nbsp; <br />端口:"+ prjvalue.port +  " </th><th><a  target = '_blank' href='http://localhost:" + prjvalue.port + "  ' style='color: #3366FF'> >>入口   </a> </th><th><a href='http://localhost:3008/cancelprj?sid="+ prjvalue._id +  "  ' style='color: #3366FF'>-注销</a></th></tr></thead><tbody><tr><td></td><td></td><td></td></tr>";
				  ep.emit(prjlistn, prjtmp);
				 
    
				}, function(err) {
				 if(err==null)  console.log(alldoc);  
					});
				
				}  //--if end
			
		});
		*/
		
		
		
		/*
		 * 
		 * 
		 * 
		 					//--1. 管理账户List
				    var cursor_admin=db.collection('admuser').find({'projid':prjvalue.projid , 'cancelstatus':1  });
				    assert.equal(err,null); //console.log('111');
				    var ad=0;
				    cursor_admin.toArray(function(err,docadm){
				    	if(docadm.length == 0)   ep.emit('adminlist', admtmp);
				    	else
				    	{    //console.log('222');
				    		  async.eachSeries(docadm, function(docvalue, callback){
						    	   ad++;
						    	   admtmp = admtmp + ad +":" + docvalue.name +"<br />";
						    	  // console.log(admtmp);
						    	   callback();
				    		  },  function(err) { if(err==null) {//  console.log(admtmp); 
				    		    ep.emit('adminlist', admtmp);
				    		  }      });   //-- async.eachSeries  end
					   }  //--if end
				    	
				    }); //cursor_admin.toArray
		 
		 * 
		 * 
		 * 
		 * 
		 * 
		 * 
		
		db.collection('users',function(err,collection){
			if(err) {console.log(err);}
				
			var cursor_users =db.collection('users').find( {'name':val,'cancelstatus' : 1} );
			var cursor_usersproject =db.collection('userproject');	
			  var flg=0, nulltmp=null;
			  var  reuu=null;
			  

	    		    	 cursor_users.toArray(function(err, doctmp) {
	    		    	    if(doctmp.length==0)       {console.log(nulltmp); } 
	    		    	    else
	    		    	    { 
	    		    	       async.eachSeries(doctmp, function(value, callback){
	    		    	    	  cursor_usersproject.findOne({'userid':value.userid ,  'projid': projID, 'cancelstatus' : 1  },function(err,result) {
	    		    	    	  assert.equal(err,null);
	    		    			  if(result !=null)  {flg=1;  reu=value;return callback(err); }
	    		    			  else
	    		    				 return callback(); 
                                  });		//--cursor_usersproject.findOne	 
	    		    	    	
                                }, function(err) {
	    		    	    		if(err)  console.log(err);  
	    		    	    	//	console.log('flg:' + flg);
	    		    	    		//console.log( reu);
	    		    	        } );   //async.eachSeries  end
	    		    	    	
	    		    	   }  //--if  end     		       
                       });     //--cursor_users.toArray end	    		
	    		  
	    		    	 var task={'a':1 , 'b':2 , 'c':3};
	    		    	 var kkk=[];
		                   var st=0;
	    		    	    async.forEachOf(task, function(value, key,callback){ kkk[st]=value; st++;console.log(value);console.log(key);callback(); }, function(err){
	    		                console.log(kkk);   
	    		    	    	var ttt=[];
	    			    		   	 
	    			    		   	 for(var i=0; i<3;i++) {
	    			    		   		 ttt[i]= kkk[i];
	    		          	   
	    		                      }
	    			    		   	 console.log(ttt);
	    		    	    	
	    		    	    	console.log(st);
	    		    	    	
	    		    	    } );
	    		    	 
	 
	    		  });      */
	    		   	 
	    		   	 
	    		   	 
	    		   	 
	    		   	 
	    		      // console.log(tasks);
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    	 
	    		    		 /*
	    		    		  * 
	    		    		  * 
	    		    		  * 
	    		    		  * 	    		    	    	
	    		    	    	
	    		    	    	console.log('LEN:' + doctmp.length); 
	    		    		    for(m in doctmp)
	    		    	           {console.log(m + ',' + doctmp[m].userid); 
	    		    		   	    cursor_usersproject.findOne({'userid':doctmp[m].userid ,  'projid': projID, 'cancelstatus' : 1  },function(err,result) {
	    		    		   		     assert.equal(err,null);
	    		    				     if(result !='') { 'M:' +m + ',' + doctmp[m].userid; }
	    		    				     else
						    	   	         if( (m+1)==doctmp.length)   {console.log('nulltmp'); } 
	    		    		     	});		//--cursor_usersproject.findOne	 
	    		    	           }//--for end	  
	    		    		  * 
	    		    		  * 
						      if(n<=count)  {				        
						            	cursor_usersproject.findOne({'userid':doctmp.userid ,  'projid': projID, 'cancelstatus' : 1  },function(err,result) {
								             assert.equal(err,null);
							    	   	     if(result !='') { console.log(doctmp); }
							    	   	     else
							    	   	         if(n==count)   {console.log(nulltmp); }        
							              });  //cursor_usersproject.findOne end if		      	
						       }
						 

 }); 
	});
     */
	    		
		
		
	    		    	    

		
		