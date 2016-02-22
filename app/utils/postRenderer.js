var app = app || {};

app.postRenderer = (function(){

	function postRenderer(config){
		this.canvasRef = config.canvasRef;
		this.shader = config.shader;
		this.texture = this.shader.ctx.createTexture();

		this.buf = this.shader.ctx.createBuffer();
		this.shader.ctx.bindBuffer(this.shader.ctx.ARRAY_BUFFER, this.buf);
	}

	function render(canvasRef){
		canvasRef = canvasRef || this.canvasRef;

		var shader = this.shader,
			ctx = shader.ctx,
			uniforms = shader.uniforms,
			attributes = shader.attributes,
			FLOATS = shader.FLOATS;

		ctx.uniform1f(uniforms['time'], (new Date().getTime()-1453776024288-2315076944));
		ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1,-1, -1,1, 1,-1, 1,-1, -1,1, 1,1]), ctx.STATIC_DRAW);

		app.texture.asTexture(this.texture, canvasRef, ctx);

		ctx.uniform1i(uniforms['uTxtSampler'], 0);
		ctx.activeTexture(ctx.TEXTURE0);
		ctx.bindTexture(ctx.TEXTURE_2D, this.texture);

		ctx.enableVertexAttribArray(attributes.aST);
		ctx.vertexAttribPointer(attributes.aST,2,ctx.FLOAT,false,2*FLOATS,0*FLOATS);
		ctx.drawArrays(ctx.TRIANGLES, 0, 6);
	}

	postRenderer.prototype = {
		render: render
	}

	return {
		init: function(config){
			return new postRenderer(config || {});
		}
	};

})();
