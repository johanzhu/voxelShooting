import * as THREE from 'three';
import Player from './player';
import Stage from './stage';
import { TweenMax } from 'gsap';
import Util from './util';

class GameScene extends THREE.Scene {
	constructor(preloader) {
		super();
		this.data = {
			id : 1,
			position: {x:0.7,y:0,z:0},
			hp:5,
			hpMax:10
		};
		this.testPlayer = new Player(this.data,preloader,'raby');
		this.camera = this.testPlayer.camera;
		//this.players = [];
		//this.yourPlayer = this.players[this.data.id];
	}
	
	init() {
		const light = new THREE.DirectionalLight();
		light.position.set(-1,3,5);
		light.castShadow = true;
		this.add(light);
		
		const ambient = new THREE.AmbientLight(0x555555);
		this.add(ambient);
		
		const stage = new Stage(0xffffff);
		this.add(stage);
		
	}
	
	addPlayer(world) {
		
		const testPlayer = this.testPlayer;
		testPlayer.character.idle();
		testPlayer.addToScene(world);
		
	}
	
	
	
	animate() {
		this.testPlayer.animate();
	}
	
	



	
}

export default GameScene;
