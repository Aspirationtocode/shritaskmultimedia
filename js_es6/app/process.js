	let distructuring = {  
		//вспомогательная функция
		createWebGLProgram(ctx, vertexShaderSource, fragmentShaderSource) {
			ctx = this.ctx;
			function compileShader(shaderSource, shaderType) {
				let shader = ctx.createShader(shaderType);
				ctx.shaderSource(shader, shaderSource);
				ctx.compileShader(shader);
				return shader;
			};

			let program = ctx.createProgram();
			ctx.attachShader(program, compileShader(vertexShaderSource, ctx.VERTEX_SHADER));
			ctx.attachShader(program, compileShader(fragmentShaderSource, ctx.FRAGMENT_SHADER));
			ctx.linkProgram(program);
			ctx.useProgram(program);

			return program;

		},
		// init webgl
		initParameters() {
	  	let ctx = this.ctx,
					video = this.video,
					fragmentShaderSource = document.getElementById("fragment-shader").text,
					vertexShaderSource = document.getElementById("vertex-shader").text,
					program = this.createWebGLProgram(ctx, vertexShaderSource, fragmentShaderSource),
		  		resolutionLocation = ctx.getUniformLocation(program, "u_resolution");
		  ctx.uniform2f(resolutionLocation, canvas.width, canvas.height);

			// Position rectangle vertices (2 triangles)
		  let positionLocation = ctx.getAttribLocation(program, "a_position");
		  let buffer = ctx.createBuffer();
		  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
			ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
		     0, 0,
		     video.width, 0,
		     0, video.height,
		     0, video.height,
		     video.width, 0,
		     video.width, video.height]), ctx.STATIC_DRAW);
			ctx.enableVertexAttribArray(positionLocation);
		  ctx.vertexAttribPointer(positionLocation, 2, ctx.FLOAT, false, 0, 0);

			//Position texture
		  let texCoordLocation = ctx.getAttribLocation(program, "a_texCoord");
		  let texCoordBuffer = ctx.createBuffer();
		  ctx.bindBuffer(ctx.ARRAY_BUFFER, texCoordBuffer);
		  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([
				0.0, 0.0,
				1.0, 0.0,
				0.0, 1.0,
				0.0, 1.0,
				1.0, 0.0,
				1.0, 1.0]), ctx.STATIC_DRAW);
		  ctx.enableVertexAttribArray(texCoordLocation);
		  ctx.vertexAttribPointer(texCoordLocation, 2, ctx.FLOAT, false, 0, 0);

		  // Create a texture.
		  let texture = ctx.createTexture();
		  ctx.bindTexture(ctx.TEXTURE_2D, texture);
		  // Set the parameters so we can render any size image.
		  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
		  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
		  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
		  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
	  },
	  
		grayScaleVideo() {
			let ctx = this.ctx;
		  // Load the frame of the video into the texture.
		  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, ctx.RGBA, ctx.UNSIGNED_BYTE, video);

		  // Draw the rectangle.
		  ctx.drawArrays(ctx.TRIANGLES, 0, 6);
		},
		computeAttrition() {
			var ctx = attritionCanvas.getContext('2d');
	  	function getRandomInterval(min, max) {
			  return Math.random() * (max - min) + min;
			}
			ctx.fillStyle = `rgba(255, 255, 255, ${getRandomInterval(0.1, 0.3)})`;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.fillRect(getRandomInterval(1, 900), getRandomInterval(1, 450), getRandomInterval(1, 10), getRandomInterval(1, 10))
	    
	    

	    return;
	  },

	  timerCallback() { 
	  	
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
	    window.requestAnimationFrame(() => {
	  		this.timerCallback();
	  	})
	  },

	  doLoad() {
	    this.video = video;
	    this.ctx = canvas.getContext("webgl");
	    this.video.play();
	    this.initParameters()
	    this.video.addEventListener("play", () => {
	      this.width = this.video.width;  
	      this.height = this.video.height;  
	      this.timerCallback();
	    }, false);
	  }

	};
	
	

	

	