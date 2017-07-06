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
		this.bullets = {};
		
		this.yourId = null;
		this.yourPlayer = null;
		
		this.originPack = null;
		this.orginPackId = [];
		
		this.instantPack = null;
		this.instantPackId = [];
		
		this.yourPack = null;
		
		this.firstInit = true;
		this.firstDif = true;
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
					
					firstInit(id,data);
					
					scope.firstInit = false;
				
				}
				
			}else{
				
				if(scope.firstInit == false) {
					
					if( scope.firstDif ) {
						
						scope.instantPackId = getIdfromPack(data);
					
						scope.instantPack = data;
						
						const newPack = scope.instantPack;
						const oldPack = scope.originPack;
						
						const addData = getAddOrRemoveData(scope.instantPackId, scope.originPackId, newPack);
						const removeData = getAddOrRemoveData( scope.originPackId, scope.instantPackId, oldPack);
						
						if( addData.length || removeData.length) {
							
							if(addData.length) addModel(addData);
							if(removeData.length) removeModel(removeData);
							
							scope.firstDif = false;
						}
						
							
					}else{
						//now it is not first dif, we store instantpack to for comparing
						if(scope.instantPack.length !== data.length) {
								//need update
								const newPackId = getIdfromPack(data);
								const oldPackId = getIdfromPack(scope.instantPack);
								
								const newPack = data;
								const oldPack = scope.instantPack;
								
								const addData = getAddOrRemoveData(newPackId, oldPackId, newPack);
								const removeData = getAddOrRemoveData( oldPackId, newPackId, oldPack);
								
								if( addData.length || removeData.length) {
									
									if(addData.length) addModel(addData);
									if(removeData.length) removeModel(removeData);
								}	
								
						}
						
						scope.instantPack = data;
						
					}
				}
				
			}
			
			switchToPlayerCamera(scope.yourId);
			
			
		});
		
		function firstInit(id,data) {
				
			console.log(id);
			
			scope.originPackId = getIdfromPack(data);
			
			console.log(scope.originPackId);
			
			scope.originPack = data;
			
			scope.yourId = id;
			console.log(data);
			
			addModel(data);
				
		}
		
		function difPack(newPackId,oldPackId,newPack) {
			
			if(JSON.stringify(newPackId) == JSON.stringify(oldPackId)) {
				//do nothing
			}else{
				
				return filter(newPackId,oldPackId,newPack);
				
			}
		}
		
		
		function addModel(initPack) {
			if(initPack.length) {
				
				for(let i = 0; i < initPack.length; i++){
				
					const player = new Player(initPack[i],preloader);
				
					scope.players[initPack[i].id] = player;
					
					player.character.rotate(initPack[i]);
					//because move is false = = !so we should directly update position
					player.character.mesh.position.x = initPack[i].position.x;
					player.character.mesh.position.y = initPack[i].position.y;
					player.character.mesh.position.z = initPack[i].position.z;
					
					player.character._$run = initPack[i].run;
					player.character._$idle = initPack[i].idle;
					player.character._$attack = initPack[i].attack;
				
					const isRun = player.character._$run;
					const isIdle = player.character._$idle;
					const isAttack = player.character._$attack;
					
					if(isRun)  {
						player.character.run();
						socket.emit('run',false);
					}
					if(isIdle) {
						player.character.idle();
						socket.emit('idle',false);
					}
					if(isAttack) {
						player.character.attack(initPack[i]);
						socket.emit('attack',false);
					}
					
					world.scene.add(player.character.mesh);
					
				}
				
			}
		}
		
		function removeModel(initPack) {
			if(initPack.length) {
				for(let i = 0; i < initPack.length; i++){
				
					delete scope.players[initPack[i].id];
					world.scene.children.forEach((model) => {
						if(model instanceof THREE.SkinnedMesh) {
							if(model.userData.id == initPack[i].id)
							world.scene.remove(model);
							Util.disposeNode(model);
						}
					});
				}
			}
		}
		
		function switchToPlayerCamera(id) {
			
			const yourId = id;
			
			scope.yourPlayer = scope.players[yourId];
					
			if(scope.yourPlayer) scope.camera = scope.yourPlayer.camera;
			
			world.changeScene(scope,scope.camera);
			
		}	
		
		function getAddOrRemoveData(newPackId,oldPackId,newPack) {
			//pass new first ,you get add id
			//pass old first ,you get remove id
			const result = [];
			const newPackIdClone = newPackId.slice(0);
			oldPackId.forEach((item) => {
				for(let i = 0; i < newPackId.length; i ++) {
					
					if(newPackId[i] == item) {
						newPackIdClone.splice(i,1,'');
					}
				}
			});
			const difId = [];
			for(let i = 0; i < newPackIdClone.length; i++) {
				if(newPackIdClone[i] !== '') {
					difId.push(newPackIdClone[i]);
				}
			}
			
			difId.forEach((id) => {
				for(let i in newPack) {
					if(newPack[i].id == id) {
						result.push(newPack[i]);
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
				if(eachId == scope.yourId) {
					scope.yourPack = data[i];
				}
				if(scope.players[eachId]) {
					
					const character = scope.players[eachId].character;
					const player = scope.players[eachId];
				
					character.rotate(data[i]);
					character.updatePos(data[i]);
									
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
						character.attack(data[i]);
						socket.emit('attack',false);
					}
					
				}
			}
			
			const yourPlayer = scope.players[scope.yourId];
			const yourPack = scope.yourPack;
			if(yourPack && yourPlayer) yourPlayer.animateCamera(yourPack);
			
			
		});
		
	}
	
	animate() {
		for(let id in this.players) {
			this.players[id].animate();
		}
	}
	
}

export default GameScene;
