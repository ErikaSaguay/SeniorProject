
$(document).ready(function () {

  $('a.thumb').click(function(event){
      	event.preventDefault();
      	var content = $('.modal-body');
      	content.empty();
        	var title = $(this).attr("title");
        	$('.modal-title').html(title);      	
        	content.html($(this).html());
        	$(".modal-profile").modal({show:true});
  });
  
  $('a.delete-btn').click(function(event){
      	event.preventDefault();
          
        	var title = $(this).attr("title");
          
          var submit = document.getElementById('submit');
          submit.setAttribute('href', '/removeOneLogo/'+title.toString()+'/');
  });


});
