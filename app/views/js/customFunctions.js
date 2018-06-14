$(document).ready(function(){	
	//For delete article request
	$(".deleteArticle").on('click',function(){
		var deleteID = $(this).data('id');
		var confirmation = confirm('Are you sure?');
		if(confirmation){
			$.ajax({
				type:'DELETE',
				url: '/articleDelete/'+deleteID
			}).done(function(response){		
				//var tempResponse = '<div class="alert alert-success"><strong>Success!</strong> Record deleted sucessfully!</div>';	
				alert('Record is being deleted!');	
				window.location.replace("/articles");	
			});
		}else{
			return false;
		}
	});
});

