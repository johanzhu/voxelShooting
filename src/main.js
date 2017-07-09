'use strict'
	import * as THREE from 'three';
	import Emitter from './emitter';
	import createjs from 'preload-js';
	import Player from './player';
	import World from './world';
	import Stage from './stage';
	import Util from './util';
	import SelectScene from './selectscene';
	import GameScene from './gamescene';
	import Stick from './stick';
	
	var world,
		selectScene,
		gameScene;
		
	const socket = io();
		
	const preloader = new createjs.LoadQueue(true);
	
	loadAssets();
	
	function onComplete() {
		
		initWorld();
		
		initSelectScene();
		
		Emitter.on('gamestart',function(characterName) {
			initGameScene(characterName);
		});
		
		Emitter.on('gameover',initGameoverScene);
		
		animate();
		
	}
	
	
	function initWorld() {
		
		const loading = document.getElementById('loading');
		const loadingBar = document.getElementById('loadingBar');
		loading.style.display = 'none';
		loadingBar.style.display = 'none';
		
		const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000);
		
		camera.position.set(0,0.1,2);
		
		camera.lookAt(new THREE.Vector3(0,0,0));
		
		world = new World(null,camera);
	    	
		world.init();
		  	
		world.removeAxis();
		
		const container = document.getElementById('world');
		setTimeout(function() {
			container.style.display = 'block';
		},500);
		
	}
	
	function initSelectScene() {
		selectScene = new SelectScene(preloader);
		selectScene.init(socket);
		
		const camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000);
		camera.position.set(0,0,1);
		
		world.changeScene(selectScene,camera);
		selectScene.addEvent(world,socket);
		
		//add light
		const light = new THREE.DirectionalLight();
		light.position.set(-1,3,5);
		light.castShadow = true;
		world.scene.add(light);
		
		const ambient = new THREE.AmbientLight(0x333333);
		world.scene.add(ambient);
		
	}
	
	function initGameScene(characterName) {
		gameScene = new GameScene(preloader);
		gameScene.init();
		
		selectScene.dispose(world);
		
		const bg = document.getElementById('world');
		bg.style.backgroundColor = '#D6D6D6';
		
		//we also change scene here
		gameScene.showAndGenPlayer(world,preloader,socket);
		
		const stick = new Stick();
		stick.init(socket);
		
		if(characterName == 'raby') {
			stick.initRabySkill(socket);
		}
		
		gameScene.updatePlayers(socket,world,characterName);
		
	}
	
	function initGameoverScene() {
		
		const world = document.getElementById('world');
		world.style.display = 'none';
		const gameover = document.getElementById('gameover');
		gameover.style.display = 'block';
		const rabySkill = document.getElementById('rabySkill');
		rabySkill.style.display = 'none';
		
	}
	
	function onProgress() {
		var percent = preloader.progress;
		const loadingBar = document.getElementById('loadingBar');
		loadingBar.style.width = 200 * percent + 'px';
	}
	
	
	function loadAssets() {
		
		preloader.on("complete", onComplete);
		
		preloader.on("progress", onProgress);
		
		preloader.loadFile({id:"raby", src:"/model/raby.json"});
		
		preloader.loadFile({id:"robo", src:"/model/robo.json"});
		
		preloader.loadFile({id:"rose", src:"/model/rose.json"});
		
		preloader.loadFile({id:"boy", src:"/model/boy.json"});
		
	}
	
	function animate() {
		
		requestAnimationFrame(animate);
		
		world.render();
		
		selectScene && selectScene.animate();
		
		gameScene && gameScene.animate();
		
		
		
	}
	
	
	
	
	
	
			