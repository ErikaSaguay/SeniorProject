$( document ).ready(function() {
	var steps = new Array();
	var scene = [];
	var ctx;
	var c = $("#logoCanvas");
	initializing();
	var drawOrder = 0;
	var dataURL = "";


	$("#step0").click(function() {
		scene.push({
			type: "background",
			xPos: 0,
			yPos: 0,
			height: c.height(),
			width: c.width(),
			position: 0,
			alphaFlag: $('#isAlpha').attr('boolean'),
			color: "#" + $('#jscolorBg').val()
		});
		$('#isAlpha').prop("disabled", true);
		$('#jsColorBg').prop("disabled", true);
		disableAndEnableStep(scene.length - 1);
		switchCase(scene);
	});
	$("#step1").click(function() { //(c.width()- obj[i].width )/ 2
		scene.push({
			type: "img",
			src: $("#selectMenuShape1 option:selected").val(),
			xPos: 50,
			yPos: 50,
			height: 400,
			width: 400,
			position: 1
		});
		drawOrder++;
		disableAndEnableStep(scene.length - 1);
		switchCase(scene);
	});
	$("#step2").click(function() {
		scene.push({
			type: "img",
			src: $("#selectMenuShape2 option:selected").val(),
			xPos: 100,
			yPos: 100,
			height: 300,
			width: 300,
			position: 2
		});
		drawOrder++;
		disableAndEnableStep(scene.length - 1);
		switchCase(scene);
	});
	$("#step3").click(function() {
		scene.push({
			type: "img",
			src: $("#selectMenu option:selected").val(),
			xPos: 225,
			yPos: 225,
			height: 50,
			width: 50,
			position: 3
		});
		drawOrder++;
		disableAndEnableStep(scene.length - 1);
		switchCase(scene);
	});
	$("#step4").click(function() {
		scene.push({
			type: "img",
			textValue: $('#canvasText').val(),
			src: "",
			height: 0,
			width: 0,
			xPos: 205,
			yPos: 205,
			font: '45px ' + $("#selectMenu3 option:selected").val(),
			textAlign: "center",
			position: 4
		});
		drawOrder++;
		disableAndEnableStep(scene.length - 1);
		switchCase(scene);
	});
	$("#step5").click(function() {
		
		scene.push({
			type: "img",
			textValue: $('#canvasText2').val(),
			src: "",
			height: 0,
			width: 0,
			xPos: 185,
			yPos: 325,
			font: "45px " + $("#selectMenu3 option:selected").val(),
			textAlign: "center",
			position: 5
		});
		drawOrder++;
		disableAndEnableStep(scene.length - 1);
		switchCase(scene);
	});

	function initializing(){ // inits all buttons, canvas, imgBuffer, and ctx objects
		c.attr("width", 500);
		c.attr("height", 500);
		ctx = c[0].getContext("2d");

		for(var i = 0; i < 6; i++)
		{
			initSteps(i);
		}
	}

	function initSteps(i){ // create steps button id's
		steps[i] = $("#step" + i);
		if (i != 0) {steps[i].prop("disabled", true);}
	}

	function switchCase(obj){
		for(var i = 0; i < obj.length; i++)
		{
			drawImage(obj,i);
		}
	}

	function drawImage(obj, i){
		switch(obj[i].type) {

			case 'background':

				drawBackground(obj[i]);
			break;

			case 'img':
				if(obj.length < 5) {
				// if object doesn't have text, don't write text in onload function
				var imgBuffer = new Image();
				imgBuffer.src = obj[i].src;
				var loaded = new Promise(function(resolve, reject) {     
					imgBuffer.addEventListener("load", resolve);
				});

				loaded.then(function() {
					ctx.drawImage(imgBuffer, obj[i].xPos, obj[i].yPos, obj[i].width, obj[i].height);
					dataURL = c[0].toDataURL();
					$('#dataURL').val(dataURL);
				});
			 }
			else{
				if(obj[i].position == 3) {
					// if object doesn't have text, don't write text in onload function
					var imgBuffer = new Image();
					imgBuffer.src = obj[i].src;
					var loaded = new Promise(function(resolve, reject) {     
						imgBuffer.addEventListener("load", resolve);
					});
					loaded.then(function() {
						if(obj.length == 6)
						{
							ctx.drawImage(imgBuffer, obj[3].xPos, obj[3].yPos, obj[3].width, obj[3].height);
							drawText(obj, ++i);
							drawText(obj, ++i);
						}else
						{
							ctx.drawImage(imgBuffer, obj[3].xPos, obj[3].yPos, obj[3].width, obj[3].height);
							drawText(obj, ++i);
						}
					});
				}
				//if object length is 5, write text after all images have loaded
				var imgBuffer = new Image();
				imgBuffer.src = obj[i].src;
				var loaded = new Promise(function(resolve, reject) {     
					imgBuffer.addEventListener("load", resolve);
				});
				loaded.then(function() {
					ctx.drawImage(imgBuffer, obj[i].xPos, obj[i].yPos, obj[i].width, obj[i].height);
					dataURL = c[0].toDataURL();
					$('#dataURL').val(dataURL);
				});		
			}
			break;

			default:
			break;
		}
	}

	function drawText(obj, i){
		var font = obj[i].font;

		ctx.font = font;
		var test = ctx.font;
		ctx.fillStyle = '#' + $('#jscolorText').val();
		ctx.fillText(obj[i].textValue, obj[i].xPos,obj[i].yPos);
		dataURL = c[0].toDataURL();
		$('#dataURL').val(dataURL);
	}
	function disableAndEnableStep(num) {
		$("#step" + num).prop("disabled", true);
		$("#step" + (num + 1)).prop("disabled", false);
	}

	function drawBackground(obj) {

		ctx.clearRect(0, 0, c.width(), c.height());
		if(obj.alphaFlag == "true") {

		}else {
			ctx.fillStyle= obj.color;
			ctx.fillRect(0,0,500,500);
		}
		
		dataURL = c[0].toDataURL();
		$('#dataURL').val(dataURL);
	}

	document.querySelector('#previousStep').onclick = function() {
		scene.pop();
		if (scene.length == 0)
		{

			drawOrder--;
			$("#step0").prop("disabled", false);
			$('#isAlpha').prop("disabled", false);
			$("#step" + (scene.length + 1)).prop("disabled", true);

			ctx.clearRect(0, 0, c.width(), c.height());
		}
		else
		{

			$("#step" + (scene.length)).prop("disabled", false);
			$("#step" + (scene.length + 1)).prop("disabled", true);
			switchCase(scene);
		}
	};

	$("a.download").click(function() {
		var dt = c[0].toDataURL();
	    canImage = document.createElement('img');
		canImage.src = dt;

		resizeImg(64, canImage);
		resizeImg(128, canImage);
		resizeImg(256, canImage);
		resizeImg(500, canImage);
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
	      $('#dl'+num).attr('download', 'logo.png');
	    });
	  }

	$( "#leftArrow" ).click(function() {
		if(scene.length > 1) {
			scene[scene.length-1].xPos = scene[scene.length-1].xPos-10;
			switchCase(scene);
		}
	});

	$( "#rightArrow" ).click(function() {
		if(scene.length > 1 ) {
			scene[scene.length-1].xPos = scene[scene.length-1].xPos+10;
			switchCase(scene);
		}
	});

	$( "#upArrow" ).click(function() {
		if(scene.length > 1 ) {
			scene[scene.length-1].yPos = scene[scene.length-1].yPos-10;
			switchCase(scene);
		}
	});

	$( "#downArrow" ).click(function() {
		if(scene.length > 1 ) {
			scene[scene.length-1].yPos = scene[scene.length-1].yPos+10;
			switchCase(scene);
		}
	});

	$( "#grow" ).click(function() {
		if(scene.length > 1 && scene.length < 5) {
			scene[scene.length-1].height = scene[scene.length-1].height+10;
			scene[scene.length-1].width = scene[scene.length-1].width+10;
			switchCase(scene);
		}else if(scene.length >= 5) {
			if(scene[scene.length -1].font.indexOf('p') == 2 || scene[scene.length -1].font.indexOf('p') == 1){	
				/* If font size is less than 100px */
				var fontSize = parseInt(scene[scene.length -1].font.substring(0,3));
				fontSize += 5;
				scene[scene.length-1].font = fontSize + "px " + $("#selectMenu3 option:selected").val();
				switchCase(scene);
			}else{
				alert("Font won't go more than 100px");
			}
		}
	});

	$( "#shrink" ).click(function() {
		if(scene.length > 1 && scene.length < 5) {
			scene[scene.length-1].height = scene[scene.length-1].height-10;
			scene[scene.length-1].width = scene[scene.length-1].width-10;
			switchCase(scene);
		}else if(scene.length >= 5) {
			if(scene[scene.length -1].font.indexOf('p') > 1){	
				/* If font size is greater than single digit */
				var fontSize = parseInt(scene[scene.length -1].font.substring(0,3));
				fontSize -= 5;
				scene[scene.length-1].font = fontSize + "px " + $("#selectMenu3 option:selected").val();
				switchCase(scene);
			}else{
				alert("Font won't go less than 0px");
			}
		}
	});
	
	$('#isAlpha').click(function(e) {
		e.preventDefault();

		if ($(this).attr('boolean') == "false") {
			$(this).attr('boolean', 'true');
			$(this).html('Off');
		}
		else {
			$(this).attr('boolean', 'false');
			$(this).html('On');
		}
	});
});