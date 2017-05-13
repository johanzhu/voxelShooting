'use strict'
	import * as THREE from 'three';
	
	const scene = new THREE.Scene();
	
	const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,2000);
	camera.position.z = 10;
	camera.lookAt(new THREE.Vector3(0,0,0));
	
	const renderer = new THREE.WebGLRenderer({
         alpha: true,
         antialias: true
	});
	
	const container = document.getElementById('world');
	container.appendChild(renderer.domElement);
	
	window.addEventListener('resize',onWindowResize,false);
	window.addEventListener('load',onWindowResize,false);
	
	function onWindowResize() {
       const WIDTH=window.innerWidth;
       const HEIGHT=window.innerHeight;
       renderer.setSize(WIDTH, HEIGHT);
       camera.aspect = WIDTH / HEIGHT;
       camera.updateProjectionMatrix();
    }
	
	const light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0,0,10);
	
	const cube = new THREE.Mesh(
		new THREE.BoxGeometry(5,5,5),
		new THREE.MeshBasicMaterial({color:0xff0000})
	);
	
	const axis = new THREE.AxisHelper(5);
	
	scene.add(cube);
	scene.add(axis);
	scene.add(light);
	
	animate();
	
	function animate() {
		requestAnimationFrame(animate);
		cube.rotation.x += Math.PI/1200;
		cube.rotation.y += Math.PI/1200;
		cube.rotation.z += Math.PI/1200;
		render();
	}
	function render() {
		renderer.render(scene,camera);
	}
	
	
	
	
	
			