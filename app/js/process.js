"use strict";

var distructuring = {
	//вспомогательная функция
	createWebGLProgram: function createWebGLProgram(ctx, vertexShaderSource, fragmentShaderSource) {
		ctx = this.ctx;
		function compileShader(shaderSource, shaderType) {
			var shader = ctx.createShader(shaderType);
			ctx.shaderSource(shader, shaderSource);
			ctx.compileShader(shader);
			return shader;
		};

		var program = ctx.createProgram();
		ctx.attachShader(program, compileShader(vertexShaderSource, ctx.VERTEX_SHADER));
		ctx.attachShader(program, compileShader(fragmentShaderSource, ctx.FRAGMENT_SHADER));
		ctx.linkProgram(program);
		ctx.useProgram(program);

		return program;
	},

	// init webgl
	initParameters: function initParameters() {
		var ctx = this.ctx,
		    video = this.video,
		    fragmentShaderSource = document.getElementById("fragment-shader").text,
		    vertexShaderSource = document.getElementById("vertex-shader").text,
		    program = this.createWebGLProgram(ctx, vertexShaderSource, fragmentShaderSource),
		    resolutionLocation = ctx.getUniformLocation(program, "u_resolution");
		ctx.uniform2f(resolutionLocation, canvas.width, canvas.height);

		// Position rectangle vertices (2 triangles)
		var positionLocation = ctx.getAttribLocation(program, "a_position");
		var buffer = ctx.createBuffer();
		ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
		ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([0, 0, video.width, 0, 0, video.height, 0, video.height, video.width, 0, video.width, video.height]), ctx.STATIC_DRAW);
		ctx.enableVertexAttribArray(positionLocation);
		ctx.vertexAttribPointer(positionLocation, 2, ctx.FLOAT, false, 0, 0);

		//Position texture
		var texCoordLocation = ctx.getAttribLocation(program, "a_texCoord");
		var texCoordBuffer = ctx.createBuffer();
		ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
		ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]), ctx.STATIC_DRAW);
		ctx.enableVertexAttribArray(texCoordLocation);
		ctx.vertexAttribPointer(texCoordLocation, 2, ctx.FLOAT, false, 0, 0);

		// Create a texture.
		var texture = ctx.createTexture();
		ctx.bindTexture(ctx.TEXTURE_2D, texture);
		// Set the parameters so we can render any size image.
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
		ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
	},
	grayScaleVideo: function grayScaleVideo() {
		var ctx = this.ctx;
		// Load the frame of the video into the texture.
		ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, video);

		// Draw the rectangle.
		ctx.drawArrays(ctx.TRIANGLES, 0, 6);
	},
	computeAttrition: function computeAttrition() {
		var ctx = attritionCanvas.getContext('2d');
		function getRandomInterval(min, max) {
			return Math.random() * (max - min) + min;
		}
		ctx.fillStyle = "rgba(255, 255, 255, " + getRandomInterval(0.1, 0.3) + ")";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillRect(getRandomInterval(1, 900), getRandomInterval(1, 450), getRandomInterval(1, 10), getRandomInterval(1, 10));

		return;
	},
	timerCallback: function timerCallback() {
		var _this = this;

		if (this.video.paused || this.video.ended) {
			if (this.video.ended) {
				audio.pause();
			}
			return;
		}

		// attrition
		this.computeAttrition();

		// grayscaleVideo
		this.grayScaleVideo();

		// rAF
		window.requestAnimationFrame(function () {
			_this.timerCallback();
		});
	},
	doLoad: function doLoad() {
		var _this2 = this;

		this.video = video;
		this.ctx = canvas.getContext("webgl");
		this.video.play();
		this.initParameters();
		this.video.addEventListener("play", function () {
			_this2.width = _this2.video.width;
			_this2.height = _this2.video.height;
			_this2.timerCallback();
		}, false);
	}
};