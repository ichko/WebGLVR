precision mediump float;

uniform sampler2D uTxtSampler;
uniform float time;
varying vec2 vST;

#define max 2.0

void main(){
	float t = time/1000.;
	vec2 origin = vec2(0.5,0.5);

	float rezolution =  1.4;
	vec2 vst = (vST + vec2(1,1))/2.;
	vec3 blur = vec3(0,0,0);


	for(float i = -max;i < max;i++){
		for(float j = -max;j < max;j++){
			blur += texture2D(uTxtSampler, vst + vec2(i,j)/500.0).xyz;
		}
	}

	vec4 color = texture2D(uTxtSampler, vec2(vst.x, vst.y));

	vec3 borderColor = vec3(0,0,0);
	float len = distance(vst, origin);

	vec3 final = mix(color.xyz, blur/15., len*1.5);

	gl_FragColor = vec4(color.xyz,1.0);
}
