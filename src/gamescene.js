import * as THREE from 'three';
import Player from './player';
import Util from './util';
import Stage from './stage';

class GameScene extends THREE.Scene {
	constructor(preloader) {
		super();
		this.players = {};
		this.playerId = 0;
		this.yourPlayer = this.players[this.playerId];
		this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000);
		this.camera.position.set(
			0,
			0.8,
			1,
		);
	}
	
	init() {
		const light = new THREE.DirectionalLight();
		light.position.set(-1,3,5);
		light.castShadow = true;
		this.add(light);
		
		const ambient = new THREE.AmbientLight(0x555555);
		this.add(ambient);
		
		const grid = new THREE.GridHelper(200,200);
		this.add(grid);
		const stage = new Stage(0xffffff);
		stage.material.transparent = true;
		stage.material.opacity = 0.7;
		stage.position.y = -0.001;
		this.add(stage);
		
	}
	
	addPlayer(world,preloader,server) {
		const scope = this;
		Emitter.on('getCharacterName',function(characterName){
			
			server.on('init',function(data){
				this.playerId = data.id;
				this.camera = this.yourPlayer.camera;
				world.changeScene(this,this.camera);
				for(var i = 0; i < data.player.length; i++){
					const player = new Player(data,preloader,characterName);
					scope.players[data.id] = player;
					world.scene.add(player.character.mesh);
				}
			});
			
		
		});
	}
	
	animate() {
		for( id in this.players) {
			this.players[id].character.animate();
		}
	}
	
	



	
}

export default GameScene;
