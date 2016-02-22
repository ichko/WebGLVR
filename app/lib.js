var app = app || {};

app.lib = (function(){

	var constants = {
			modelMatrixName: 'uModelMatrix',
			baseUrl: 'app',
			shadersPath: 'app/shaders/',
		};

	function lib(config) {
		this.preGl = app.gl.init({canvasId: 'preCanvas', clearColor: [0.9,0.9,0.9,0.5]}),
		this.postGl = app.gl.init({canvasId: 'postCanvas'});
		this.postRightGl = app.gl.init({canvasId: 'postCanvasRight'});

		this.modelMatrix = app.matrix4.init(),

		this.camera = app.flyingCamera.init({
			aspect: this.preGl.canvas.width / this.preGl.canvas.height,
			poz: app.vector3.init(3,3,3),
			eye: app.vector3.init(0,0,1),
			up: app.vector3.init(0,0,1)
		}),

		this.cameraControl = app.cameraControl.init({
			camera: this.camera,
			inputHandler: app.inputHandler,
			element: this.postGl.canvas
		}),

		this.frame = 0,
		this.userUpdateFunc = config.update,
		this.userInitFunc = config.init,
		this.scene = [],
		this.renderer = {},
		this.postRenderer = {},
		this.postRendererRight = {},
		this.materialShader = {},
		this.imageShader = {};

		loadShaders.call(this);
	}


	function loadShaders() {
		var me = this;
		app.shader.get({
			vShaderName: 'vshader.vs.glsl',
			fShaderName: 'fshader.fs.glsl',
			requester: app.requester.init(constants.shadersPath),
			ctx: me.preGl.ctx,
			success: function(materialShader){
				this.materialShader = materialShader;
				me.renderer = app.renderer.init({
					gl: me.preGl,
					shader: this.materialShader,
					modelMatrix: me.modelMatrix,
				});

				loadPostShader.call(me);
			}
		});
	}

	function loadPostShader(){
		var me = this;
		app.shader.get({
			vShaderName: 'imageShader.vs.glsl',
			fShaderName: 'imageShader.fs.glsl',
			requester: app.requester.init(constants.shadersPath),
			ctx: me.postGl.ctx,
			success: function(imageShader){
				me.postRenderer = app.postRenderer.init({
					canvasRef: me.preGl.canvas,
					shader: imageShader
				});

				me.imageShader = app.shader.init({
					vShaderSrc: imageShader.vShaderSrc,
					fShaderSrc: imageShader.fShaderSrc,
					ctx: me.postRightGl.ctx
				}).compile();

				me.postRendererRight = app.postRenderer.init({
					canvasRef: me.preGl.canvas,
					shader: me.imageShader
				});

				if(me.userInitFunc) me.userInitFunc(me);
				if(me.userUpdateFunc) animate.call(me);
			}
		});
	}

	function animate() {
		var me = this;
		me.resizeCanvas();
		me.userUpdateFunc(me);
		me.frame++;

		requestAnimationFrame(function() {
			animate.call(me);
		});
	}

	function resizeCanvas(){
		var canvas = this.preGl.canvas;

		var displayWidth  = canvas.clientWidth;
		var displayHeight = canvas.clientHeight;

		if(canvas.width  != displayWidth || canvas.height != displayHeight) {
			canvas.width  = displayWidth;
			canvas.height = displayHeight;
			this.preGl.ctx.viewport(0, 0, canvas.width, canvas.height);

			this.camera = app.flyingCamera.init({
				aspect: this.preGl.canvas.width / this.preGl.canvas.height,
				poz: this.camera.poz,
				eye: this.camera.eye,
				up: this.camera.up
			});

			this.cameraControl.camera = this.camera;
		}
	}

	lib.prototype = {
		resizeCanvas: resizeCanvas
	}

	return {
		init: function(config) {
			return new lib(config || {});
		}
	};

})();
