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



function cancelusers(sid, userid)
{
	con=confirm("确定要注销吗?");
	//alert('ID:' + userid)
	if(con==true) {
		
		$.ajax({
			url:'/cancelUser',
			data:{id:sid},
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


function setSession(key,value)
{
		$.ajax({
			url:'/setSession',
			data:{'value':value, 'key':key},
			type:'GET',
			datatype:'json',
			
		   success: function(data) {
			 if(data.des!=true) alert('warn:' + data.des);
		   }      
			 
		})   //ajax  end

}















