$( document ).ready(function() {
	var steps = new Array();
	var scene = [];
	var ctx;
	var c = $("#logoCanvas");
	//var b = document.querySelector('button');
	var deg = document.querySelector('input');
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
			position: 0
		});
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
			font: "45px " + $("#selectMenu3 option:selected").val(),
			textAlign: "center",
			position: 4
		});
		disableAndEnableStep(scene.length - 1);
		switchCase(scene);
	});

	function initializing(){ // inits all buttons, canvas, imgBuffer, and ctx objects
		c.attr("width", 500)
		c.attr("height", 500);
		ctx = c[0].getContext("2d");

		for(var i = 0; i < 5; i++)
		{
			initSteps(i);
		}
	}

	function initSteps(i){ // create steps button id's
		steps[i] = $("#step" + i);
		if (i != 0) {steps[i].prop("disabled", true);}
	}

	function rotate(degrees) { // rotates image on selected canvas
		console.log("rotate function");
	}

	function switchCase(obj){
		//drawBackground();
		for(var i = 0; i < obj.length; i++)
		{
			drawImage(obj,i);
		}
	}

	function drawImage(obj, i){
		switch(obj[i].type) {

			case 'background':
				drawBackground();
				console.log('bg');
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
					console.log(obj[i].position)
					$('#dataURL').val(dataURL);
					console.log()
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
						console.log(obj[i].position)
					});
					loaded.then(function() {
						ctx.drawImage(imgBuffer, obj[3].xPos, obj[3].yPos, obj[3].width, obj[3].height);
						ctx.font = obj[4].font;
						console.log(ctx.font);
						ctx.fillStyle = '#' + $('#jscolorText').val();
						console.log(ctx.fillStyle);
						ctx.fillText(obj[4].textValue, obj[4].xPos,obj[4].yPos);
						dataURL = c[0].toDataURL();
						$('#dataURL').val(dataURL);
					});
					// loaded.the
				}
				//if object length is 5, write text after all images have loaded
				var imgBuffer = new Image();
				imgBuffer.src = obj[i].src;
				var loaded = new Promise(function(resolve, reject) {     
					imgBuffer.addEventListener("load", resolve);
				});
				loaded.then(function() {
					ctx.drawImage(imgBuffer, obj[i].xPos, obj[i].yPos, obj[i].width, obj[i].height);
					console.log(obj[i].position)
					dataURL = c[0].toDataURL();
					$('#dataURL').val(dataURL);
				});
							
			}
			break;

			default:
			break;
		}
	}

	function disableAndEnableStep(num) {
		$("#step" + num).prop("disabled", true);
		$("#step" + (num + 1)).prop("disabled", false);
	}

	function drawBackground(fillStyle) {
		ctx.fillStyle="#" + $('#jscolorBg').val();
		console.log($('.jscolorBg').val());
		ctx.fillRect(0,0,500,500);
		dataURL = c[0].toDataURL();
		$('#dataURL').val(dataURL);
	}
	//Events
	
	// b.onclick = function() {
	// 	rotate(deg.value);
	// };

	document.querySelector('#previousStep').onclick = function() {
		scene.pop();
		drawOrder--;
		if (scene.length == 0)
		{
			$("#step0").prop("disabled", false);
			$("#step" + (scene.length + 1)).prop("disabled", true);

			ctx.clearRect(0, 0, c.width(), c.height());
			console.log('clear everything')
		}
		else
		{
			$("#step" + (scene.length)).prop("disabled", false);
			$("#step" + (scene.length + 1)).prop("disabled", true);
		switchCase(scene);
		}
	};
	
	$('#dl32').click(dlCanvas32);
	$('#dl64').click(dlCanvas64);
	$('#dl128').click(dlCanvas128);

	function submitClick(){
		var dt = c[0].toDataURL();
		  /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
		  dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

		  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
		  dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=CompanyLogo.png');


		  this.href = dt;
	}

	function dlCanvas32() {
		var dt = c[0].toDataURL();
	    imageFoo = document.createElement('img');
		imageFoo.src = dt;

		// Style your image here
		imageFoo.style.width = '32px';
		imageFoo.style.height = '32px';
		console.log("32");

		var dt = c[0].toDataURL();
		/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
		dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

		/* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
		dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=CompanyLogo.png');
		this.href = dt;
	};
	function dlCanvas64() {
		var dt = c[0].toDataURL();
	    imageFoo = document.createElement('img');
		imageFoo.src = dt;

		// Style your image here
		imageFoo.style.width = '64px';
		imageFoo.style.height = '64px';

		var dt = c[0].toDataURL();
		/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
		dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

		/* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
		dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=CompanyLogo.png');
		this.href = dt;
	};
	function dlCanvas128() {
		var dt = c[0].toDataURL();
	    imageFoo = document.createElement('img');
		imageFoo.src = dt;

		// Style your image here
		imageFoo.style.width = '128px';
		imageFoo.style.height = '128px';

		var dt = c[0].toDataURL();
		/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
		dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

		/* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
		dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=CompanyLogo.png');
		this.href = dt;
	};

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
		}else if(scene.length == 5) {
			var fontSize = parseInt(scene[scene.length -1].font.substring(0,2));
			fontSize = fontSize + 5;
			scene[scene.length -1].font.setCharAt(0, fontSize.toString());
			console.log(scene[scene.length -1].font);
		}
	});

	$( "#shrink" ).click(function() {
		if(scene.length > 1 && scene.length < 5) {
			scene[scene.length-1].height = scene[scene.length-1].height-10;
			scene[scene.length-1].width = scene[scene.length-1].width-10;
			switchCase(scene);
		}else if(scene.length == 5) {
			
		}
	});
	
});