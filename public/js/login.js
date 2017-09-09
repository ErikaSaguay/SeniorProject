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
    $("div a.bordered-text").on("click", function () {

    if (!$(this).hasClass("bordered-text-focus")) {

      var targetSection = $(this).attr("id").replace("nav-", "").replace("-btn", "");
      $('div a.bordered-text').removeClass('bordered-text-focus');
      $(this).addClass('bordered-text-focus');
      $('div a.bordered-text').removeClass('select');
      $(this).addClass('select');
      $("#content-wrapper section").stop(true, true).fadeOut(400);
      $('#' + targetSection).delay(400).fadeIn(400);

    }
  });
  
  //login 
  $('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
  var $this = $(this),
      label = $this.prev('label');

	  if (e.type === 'keyup') {
			if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
    	if( $this.val() === '' ) {
    		label.removeClass('active highlight'); 
			} else {
		    label.removeClass('highlight');   
			}   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
    		label.removeClass('highlight'); 
			} 
      else if( $this.val() !== '' ) {
		    label.addClass('highlight');
			}
    }

});

$('.tab a').on('click', function (e) {
  
  e.preventDefault();
  
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  
  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();
  
  $(target).fadeIn(600);
  
});

});

