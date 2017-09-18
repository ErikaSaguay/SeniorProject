
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


    $("a.download").click(function(event) {
      event.preventDefault();

      /* sets the name attribute to var */
      var name = $(this).attr("name");

      /* sets href to title of download button */
      $('#dl500').attr('href', $(this).attr("title"));
      
      
      /* creates img tag */
      var canImage = document.createElement('img');

       /* img source is title attr of download button */
       canImage.src = $(this).attr("title");

       

       resizeImg(64, canImage);
       resizeImg(128, canImage);
       resizeImg(256, canImage);

       /* sets download name to name variable */
       $('#dl64').attr('download', name);
       $('#dl128').attr('download', name);
       $('#dl256').attr('download', name);
       $('#dl500').attr('download', name);
    
  });

  function resizeImg(num, canImage){

    // Image Style
    canImage.style.width = num+'px';
    canImage.style.height = num+'px';

    var canvas64 = $('<canvas/>');
    canvas64.attr("width", num);
    canvas64.attr("height", num);
    var ctx64 = canvas64[0].getContext('2d');
    var imgBuffer = new Image();
    imgBuffer.src = canImage.src;
    var loaded = new Promise(function(resolve, reject) { 
      imgBuffer.addEventListener("load", resolve);
    });
    loaded.then(function() {
      ctx64.drawImage(imgBuffer, 0,0, num, num);
      var smallDt = canvas64[0].toDataURL();
      /* Change MIME type to trick the browser to download the file instead of displaying it */
      smallDt = smallDt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
      $('#dl'+num).attr('href', smallDt);
      
    });
  }
});
