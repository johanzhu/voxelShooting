'use strict'
	import * as THREE from 'three';
	import Player from './player';
	import World from './world';
	
	
	var world;
	
	initWorld();
	
	
	
	const player = new Player(0,{x:0,y:0});
	
	world.scene.add(player.mesh);
	
	
	
	animate();
	
	function initWorld() {
		
		world = new World();
	    	
		world.init();
		  	
		world.removeAxis();
		
	}
	
	
	function animate() {
		
		requestAnimationFrame(animate);
		
		world.render();
		
	}
	
	
	
	
	
	
			