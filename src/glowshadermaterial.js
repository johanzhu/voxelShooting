import * as THREE from 'three';

const GlowShaderMaterial	= function(camera){
	
	const vertexShader = [
		"#include <common>",
		 "#include <skinning_pars_vertex>",
		 "varying float intensity;",
		 "void main() {",		
			"#include <skinbase_vertex>",
			"#include <begin_vertex>",
			"#include <beginnormal_vertex>",
			"#include <skinning_vertex>",
			"#include <skinnormal_vertex>",
			"vec3 vNormal = normalize( normalMatrix * objectNormal );",
			"vec4 mvPosition = modelViewMatrix * skinned;",
			"vec3 vNormel = normalize( -mvPosition.xyz);",
			'intensity = pow( 1.0 - dot(vNormal, vNormel), 5.0 );',
			"vNormal = normalize(normalMatrix*normal);",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join('\n');
	
	const fragmentShader	= [
		 "varying float intensity;",
			 "void main() {",	
		 		"gl_FragColor = vec4(intensity);",
			 "}",
	].join('\n');

	const material	= new THREE.ShaderMaterial({
		vertexShader	: vertexShader,
		fragmentShader	: fragmentShader,
		side		: THREE.FrontSide,
		blending	: THREE.AdditiveBlending,
		transparent	: true,
		skinning    : true
	});
	
	return material;
	
};

export default GlowShaderMaterial;