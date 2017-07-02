import * as THREE from 'three';
import Player from './player';
import Util from './util';
import Stage from './stage';

class GameScene extends THREE.Scene {
	constructor(preloader) {
		super();
		this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000);
		this.camera.position.set(
			0,
			0.3,
			1,
		);
		this.players = {};
		this.yourPlayer = null;
	}
	
	init() {
		const light = new THREE.DirectionalLight();
		light.position.set(-1,3,5);
		light.castShadow = true;
		this.add(light);
		
		const ambient = new THREE.AmbientLight(0x555555);
		this.add(ambient);
		
		const grid = new THREE.GridHelper(200,800);
		this.add(grid);
		const stage = new Stage(0xffffff);
		stage.material.transparent = true;
		stage.material.opacity = 0.7;
		stage.position.y = -0.001;
		this.add(stage);
		
	}
	
	showAndGenPlayer(world,preloader,socket) {
		
		const scope = this;
		
		Emitter.on('getCharacterName',function(characterName){
			
			socket.on('init',function(data){
				
				const yourId = data.id;
				
				world.changeScene(scope,scope.camera);
				
				for(let i = 0; i < data.player.length; i++){
					
					const player = new Player(data.player[i],preloader);
					
					scope.players[data.player[i].id] = player;
					
					player.addToScene(world);
					
					
				}
				
				scope.yourPlayer = scope.players[yourId];
				
				world.camera = scope.yourPlayer.camera;
				
			});
			
		
		});
	}
	
	
	updatePlayers(socket) {
		const scope = this;
		socket.on('update',(data) => {
			
			for(let i = 0; i < data.length; i++){
				const eachId = data[i].id;
				const character = scope.players[eachId].character;
				const player = scope.players[eachId];
				character.rotate(data[i]);
				character.updatePos(data[i]);
				player.update
				
				character._$run = data[i].run;
				character._$idle = data[i].idle;
				character._$attack = data[i].attack;
				
				const isRun = character._$run;
				const isIdle = character._$idle;
				const isAttack = character._$attack;
				
				if(isRun)  {
					character.run();
					socket.emit('run',false);
				}
				if(isIdle) {
					character.idle();
					socket.emit('idle',false);
				}
				if(isAttack) {
					character.attack();
					socket.emit('attack',false);
				}
				
				
			}
			
		});
		
	}
	
	animate() {
		for(let id in this.players) {
			this.players[id].animate();
		}
	}
	
}

export default GameScene;
