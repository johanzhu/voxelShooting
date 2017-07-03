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
		this.yourPlayer = null;
		this.newPackId = [];
		this.oldPackId = [];
		this.oldPack = null;
		this.newPack = null;
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
				
				scope.oldPack = data;
				
				scope.oldPackId = getKeyArr(scope.oldPack);
				
				addModel(data);
				
				
			}else{
				
				scope.newPack = data;
				
				scope.newPackId = getKeyArr(scope.newPack);
				
				if( scope.newPack  !== scope.oldPack  ) {
					
					const filteredData = filterData(scope.newPack,scope.oldPack);
				
					addModel(filteredData);
					
					scope.oldPack = scope.newPack;
					
				}else{
					
					console.log('居然一样了。。');
					
				}
				
				
			}
			
			
					
			function addModel(initPack) {
				
				if(initPack.length) {
					
					for(let i = 0; i < initPack.length; i++){
					
						const player = new Player(initPack[i],preloader);
						
						scope.players[initPack[i].id] = player;
						
						world.scene.add(player.character.mesh);
						
					}
					
				}
			}
			
			function getPlayerCamera() {
			
				const yourId = id;
				
				scope.yourPlayer = scope.players[yourId];
						
				scope.camera = scope.yourPlayer.camera;
				
			}	
			
		});
		
		function getKeyArr(obj) {
			let arr = [];
			for(let i in obj) {
				arr.push(obj[i].id);
			}
			arr.sort();
			return arr;
		}
		
		function filterData(newPack,oldPack) {
			// 新的pack里面有更多的id和player
			// 这个函数是从我们新的pack里面把老的pack的对应id的东西都删除掉那么我们可以遍历key？
			let oldPackKey = [];
			let result = {};
			for(let i in oldPack) {
				oldPackKey.push(Number(i));				
			}
			
			for(let i in newPack) {
				
				let hasKeyInOldPack = oldPackKey.some((key) => i == key);
				//不存在的话
				if(!hasKeyInOldPack) result[i] = newPack[i]; 
				
			}
			
			return result;
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
