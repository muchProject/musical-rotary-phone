/*
 		$.ajax({
			 
		    // The URL for the request
		    url: "canceladm.js",
		 
		    // The data to send (will be converted to a query string)
		    data: {
		        id: auid
		    },
		 
		    // Whether this is a POST or GET request
		    type: "GET",
		 
		    // The type of data we expect back
		    dataType : "json",
		})
		  // Code to run if the request succeeds (is done);
		  // The response is passed to the function
		  .done(function( json ) {
			  alert(json);
		    // $( "<h1>" ).text( json.title ).appendTo( "body" );
		    // $( "<div class=\"content\">").html( json.html ).appendTo( "body" );
		  })
		  
*/

function canceladm(auid)
{
con=confirm("确定要注销吗?");
	
if(con==true) {

$.ajax({
url:'/cancelAdm',
data:{id:auid,},
type:'GET',
dataType:'json',   

success: function(data){
	var admclass= 'div.adm'+auid;
	if(data.des == true)  { alert('注销成功'); $(admclass).hide("slow");}
	else  alert('warn:' + data.des);
}

})
	
		
//alert(auid);
} 
}





function cancelmod(modid)
{
	con=confirm("确定要注销吗?");
	
	if(con==true) {
		//alert('ID:' + modid)
		$.ajax({
			url:'/cancelMod',
			data:{id:modid,},
			type:'GET',
			datatype:'json',
			
		   success: function(data) {
			 var modclass='div.mod' +modid;
			 if(data.des==true) { alert('注销成功'); $(modclass).hide("slow");}
				else  alert('warn:' + data.des);
		   }      
			
		})   //ajax  end
	}
}



function cancelusers(userid, projid)
{
	con=confirm("确定要注销吗?");
	//alert('ID:' + userid)
	if(con==true) {
		
		$.ajax({
			url:'/cancelUser',
			data:{id:userid, prjid: projid},
			type:'GET',
			datatype:'json',
			
		   success: function(data) {
			 var userclass='div.usersclass' +userid;
			 if(data.des==true) { alert('注销成功'); $(userclass).hide("slow");}
				else  alert('warn:' + data.des);
		   }      
			
		})   //ajax  end
	}
}



function ajaxUpdateUserModule(prjid,userid,modid)
{
	
	var boxstr='input.classcheckbox' + modid;
	var reu = $(boxstr).is(':checked');
	if(reu)    //如果被选中
		{
		  con=confirm("确定要添加此权限给用户吗?");
			if(con==true) {
			//alert('是的'+ prjid +','+userid+','+modid);
			$.ajax({
				url:'/ajaxUpdateUserModule',
				data:{'prjid':prjid, 'userid': userid  , 'modid':modid  ,  'flag':1},
				type:'GET',
				datatype:'json',
				
			   success: function(data) {
				
				 if(data.des==true)  alert('添加成功'); 
					else  alert('warn:' + data.des);
			   }      
				
			})   //ajax  end
			
			
			
			}
		
		} else {   //如果没有被选中
			con=confirm("确定要注销用户这个权限吗?");
			if(con==true) {
				//alert('是的'+ prjid +','+userid+','+modid);
				$.ajax({
					url:'/ajaxUpdateUserModule',
					data:{'prjid':prjid, 'userid': userid  , 'modid':modid  ,  'flag':0},
					type:'GET',
					datatype:'json',
					
				   success: function(data) {
					
					 if(data.des==true)  alert('注销成功'); 
						else  alert('warn:' + data.des);
				   }      
					
				})   //ajax  end
			}
			
		}
	


}





