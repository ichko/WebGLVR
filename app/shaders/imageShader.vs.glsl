precision mediump float;

uniform sampler2D uTxtSampler;
attribute vec2 aST;

varying vec2 vST;

void main(){
	gl_Position = vec4(aST.x, aST.y, 0,1);
	vST = aST;
}