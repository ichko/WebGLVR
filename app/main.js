var preCanvas = document.getElementById('preCanvas'),
	postCanvas = document.getElementById('postCanvas'),
	postRighEye = document.getElementById('postCanvasRight');
	scene = [];

app.inputHandler.bindEvents(postCanvas);
app.inputHandler.bindEvents(postRighEye);
app.inputHandler.lockPointer(postCanvas);
app.inputHandler.lockPointer(postRighEye);
app.inputHandler.bindFullScreen(postCanvas);
app.inputHandler.bindFullScreen(postRighEye);

var plane = new app.plane({ width: 30, height: 30, material: {color: [0,0,0]}, wireframe: true }),
	torus = new app.torus({material: {color: [0.2,0.2,0.3]}});

scene.push(plane, torus);

var stats = new Stats();
stats.setMode(0);
stats.domElement.style.position = 'absolute';
document.body.appendChild( stats.domElement );

var lib = app.lib.init({ update: update });

function update(){
	stats.begin();
	lib.postRightGl.clear();
	lib.postGl.clear();
	lib.preGl.clear();
	lib.cameraControl.update();

	lib.renderer.drawScene(scene, lib.camera);
	lib.postRenderer.render();

	lib.renderer.gl.clear();
	lib.camera.right(0.1);
	lib.renderer.drawScene(scene, lib.camera);
	lib.postRendererRight.render();
	lib.camera.left(0.1);
	stats.end();
}
