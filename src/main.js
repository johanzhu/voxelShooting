'use strict'
	import * as THREE from 'three';
	import Player from './player';
	
	const scene = new THREE.Scene();
	
	const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,1,2000);
	camera.position.z = 20;
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
	light.position.set(0,0,20);
	
	const cube = new THREE.Mesh(
		new THREE.BoxGeometry(3,3,3),
		new THREE.MeshPhongMaterial({color:0xff0ff0})
	);
	
	const player = new Player(1,2);
	
	const axis = new THREE.AxisHelper(5);
	
	scene.add(cube);
	scene.add(axis);
	scene.add(light);
	scene.add(player.mesh);
	player.sayHi();
	animate();
	
	function animate() {
		requestAnimationFrame(animate);
		cube.rotation.x += Math.PI/1200;
		cube.rotation.y += Math.PI/1200;
		cube.rotation.z += Math.PI/1200;
		player.mesh.rotation.y += Math.PI/600;
		render();
	}
	function render() {
		renderer.render(scene,camera);
	}
	
	
	
	
	
			