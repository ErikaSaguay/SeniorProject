
$(document).ready(function () {
	function setLoading(target, effect) {
		$(target).append('\
			<div class="loading-frame"><div class="loading-frame-bg"></div><h3><span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span></h3></div>');
		if (effect === "fade") {
			$(".loading-frame").fadeIn(400);
		} else {
			$(".loading-frame").css("display", "block");
		}
	}

	function clearLoading() {
		$(".loading-frame").fadeOut(400, function () {
			$(this).remove();
		});
	}
	//Nav Links
    $("nav a.bordered-text").on("click", function () {
    if (!$(this).hasClass("bordered-text-focus")) {
      var targetSection = $(this).attr("id").replace("nav-", "").replace("-btn", "");
      $('nav a.bordered-text').removeClass('bordered-text-focus');
      $(this).addClass('bordered-text-focus');
      $("#content-wrapper section").stop(true, true).fadeOut(400);
      $('#' + targetSection).delay(400).fadeIn(400);
    }
  });
    //Home links 
    $("section a.nav-link").on("click", function () {
    if (!$(this).hasClass("bordered-text-focus")) {
      var targetSection = $(this).attr("id").replace("a-", "").replace("-link", "");
      $('nav a.bordered-text').removeClass('bordered-text-focus');
      $(this).addClass('bordered-text-focus');
      $("#content-wrapper section").stop(true, true).fadeOut(400);
      $('#' + targetSection).delay(400).fadeIn(400);
    }
  });
$('a.thumb').click(function(event){
    	event.preventDefault();
    	var content = $('.modal-body');
    	content.empty();
      	var title = $(this).attr("title");
      	$('.modal-title').html(title);      	
      	content.html($(this).html());
      	$(".modal-profile").modal({show:true});
});


});
