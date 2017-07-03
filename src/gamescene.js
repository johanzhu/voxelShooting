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
			0.8,
			1,
		);
		this.camera.lookAt(new THREE.Vector3(0,0,0));
		this.players = {};
		this.yourId = null;
		this.yourPlayer = null;
		
		this.oldPack = null;
		this.newPack = null;
		
		this.firstInit = true;
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
		
		world.changeScene(scope,scope.camera);
		
		socket.on('init',function(data,id){
			
			if(id) {
				
				if(scope.firstInit) {
					
					console.log(id);
					
					scope.firstInit = false;
					
					scope.yourId = id;
					
					scope.oldPack = data;
					
					//第一次初始化
					addModel(data);
					
				}
				
			}else{
				
				scope.newPack = data;
				
				const filteredData = filterData(scope.newPack,scope.oldPack);
				
				addModel(filteredData);
				
			}
			
			switchToPlayerCamera(scope.yourId);
			
			function addModel(initPack) {
				
				if(initPack.length) {
					
					for(let i = 0; i < initPack.length; i++){
					
						const player = new Player(initPack[i],preloader);
						
						scope.players[initPack[i].id] = player;
						
						world.scene.add(player.character.mesh);
						
					}
					
				}
			}
			
		});
		
		function switchToPlayerCamera(id) {
			
				const yourId = id;
				
				scope.yourPlayer = scope.players[yourId];
						
				scope.camera = scope.yourPlayer.camera;
				
			}	
		
		function filterData(newPack,oldPack) {
			let result = {};
			let oldPackId = getIdfromPack(oldPack);
			let newPackId = getIdfromPack(newPack);
			oldPackId.forEach((oldId) => {
				for(let id in newPack) {
					if(id !== oldId) {
						result[id] = newPack[id];
					}
				}
			});
			
			return result;
		}
		
		function getIdfromPack(obj) {
			let arr = [];
			for(let i in obj) {
				arr.push(obj[i].id);
			}
			arr.sort();
			return arr;
		}
	
	}
	
	updatePlayers(socket) {
		const scope = this;
		socket.on('update',(data) => {
			for(let i = 0; i < data.length; i++){
				
				const eachId = data[i].id;
				
				if(scope.players[eachId]) {
					
					const character = scope.players[eachId].character;
					const player = scope.players[eachId];
				
					character.rotate(data[i]);
					character.updatePos(data[i]);
					player.animateCamera(data[i]);
									
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
