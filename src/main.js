'use strict'
	import * as THREE from 'three';
	import createjs from 'preload-js';
	import Player from './player';
	import World from './world';
	
	var world;
	
	const preloader = new createjs.LoadQueue(true);
	
	console.log('注意重新开始！');
	 
	console.log(preloader);
	
	
	loadAssets();
	function onComplete() {
		console.log(1);
		initWorld();
		
		console.log(preloader.getResult('archer'));
		
		const player = new Player(0,{x:0,y:0});
	
		world.scene.add(player.mesh);
		
		animate();
		
	}
	
	function onProgress() {
		
		var percent = preloader.progress*100;
		console.log(percent);
		
	}
	
	
	function loadAssets() {
		
		preloader.on("complete", onComplete);
		
		preloader.on("progress", onProgress);
		
		preloader.loadFile({id:"archer", src:"/model/girl.json"});
		
	}
	
	function initWorld() {
		
		world = new World();
	    	
		world.init();
		  	
		world.removeAxis();
		
	}
	
	
	function animate() {
		
		requestAnimationFrame(animate);
		
		world.render();
		
	}
	
	
	
	
	
	
			