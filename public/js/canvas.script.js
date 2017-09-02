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
  
	var bgImageSrc = [];
	bgImageSrc.push("static/images/background_images/bluesquare.png");
	bgImageSrc.push("static/images/background_images/purplesquare.png");
	bgImageSrc.push("static/images/background_images/redsquare.png");

	$("#step0").click(function() {
		scene.push({
			type: "img",
			src: bgImageSrc[0],
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
			src: "static/images/circle_outline.png",
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
			src: "static/images/circle_outline.png",
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
			textValue: "GoLogos",
			src: "",
			height: 0,
			width: 0,
			xPos: 250,
			yPos: 250,
			font: "45px Indie Flower",
			textAlign: "center",
			position: 4
		});
		disableAndEnableStep(scene.length - 1);
		switchCase(scene);
	});

	function initializing(){ // inits all buttons, canvas, imgBuffer, and ctx objects
		//c.css({position: 'absolute'});
		c.attr("width", 500)
		c.attr("height", 500);
		ctx = c[0].getContext("2d");

		for(var i = 0; i < 5; i++)
		{
			initSteps(i);
		}
	}

	function initSteps(i){ // create steps button id's
		steps[i] = document.getElementById("step" + i);
		if (i != 0) {steps[i].style.visibility = "hidden";}
	}

	function rotate(degrees) { // rotates image on selected canvas
		console.log("rotate function");
	}

	function switchCase(obj){
		ctx.clearRect(0, 0, c.width(), c.height());
		if(obj.length <=4){
			for(var i = 0; i < obj.length; i++)
			{
				drawImage(obj,i);
			}
		}else{

			for(var i = 0; i < obj.length - 2; i++)
			{
				drawImage(obj,i);
			}

			var imgBuffer = new Image();
			imgBuffer.src = obj[3].src;
			var loaded = new Promise(function(resolve, reject) {     
				imgBuffer.addEventListener("load", resolve);
			});

			loaded.then(function() {
			   // imgProperties(imgBuffer, obj[i]);
				ctx.drawImage(imgBuffer, obj[3].xPos, obj[3].yPos, obj[3].width, obj[3].height);
				ctx.font = obj[4].font;
				//ctx.textAlign = obj[i].textAlign;
				//ctx.fillText(obj[i].textValue, (obj[i - 1].xPos + obj[i].xPos) / 2 ,obj[i - 1].yPos + obj[i - 1].height + 20);
				
				ctx.fillText(obj[4].textValue, 205,205);
				dataURL = c[0].toDataURL();
				$('#dataURL').val(dataURL);
			});
		}
	}

	function drawImage(obj, i){
				var imgBuffer = new Image();
				imgBuffer.src = obj[i].src;
				var loaded = new Promise(function(resolve, reject) {     
					imgBuffer.addEventListener("load", resolve);
				});

				loaded.then(function() {
				   // imgProperties(imgBuffer, obj[i]);
					ctx.drawImage(imgBuffer, obj[i].xPos, obj[i].yPos, obj[i].width, obj[i].height);
				});
	}

	function disableAndEnableStep(num) {
		$("#step" + num).css("visibility", "hidden");
		$("#step" + (num + 1)).css("visibility", "visible");
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
			$("#step0").css("visibility", "visible");
			$("#step" + (scene.length + 1)).css("visibility", "hidden");
		}
		else
		{
			$("#step" + (scene.length)).css("visibility", "visible");
			$("#step" + (scene.length + 1)).css("visibility", "hidden");
		}
		switchCase(scene);
	};

	//document.getElementById("submit").addEventListener("click", submitClick);

	document.getElementById("dl").addEventListener("click", dlCanvas, false);


	function submitClick(){
		var dt = c[0].toDataURL();
		  /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
		  dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

		  /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
		  dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');

		  this.href = dt;
	}

	function dlCanvas() {
		var dt = c[0].toDataURL();
		/* Change MIME type to trick the browser to downlaod the file instead of displaying it */
		dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

		/* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
		dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
		this.href = dt;
	};


});