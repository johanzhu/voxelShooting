import * as THREE from 'three';
import Character from './character';
import Arrow from './arrow';
import Stage from './stage';
import { TweenMax } from 'gsap';
import Util from './util';
import Emitter from './emitter';

class SelectScene extends THREE.Scene {
	constructor(preloader) {
		super();
		this.raby = new Character(preloader.getResult('raby'),null,true); 
		this.robo = new Character(preloader.getResult('robo'),null,true);
		this.rose = new Character(preloader.getResult('rose'),null,true); 
		this.boy = new Character(preloader.getResult('boy'),null,true);
		this.characters = [this.raby,this.robo,this.rose,this.boy];
		this.arrows = [new Arrow(),new Arrow(),new Arrow(),new Arrow()];
		this.event = null;
	}
	
	init(socket) {
		for(let i = 0; i < 4; i++) {
			const scope = this;
			//add character
			this.characters[i].mesh.position.x = -0.43 + i * 0.3;
			this.characters[i].mesh.position.y = -0.2;
			this.add(this.characters[i].mesh);
			this.characters[i].idle();
			
			//add arrow
			if(i == 1) this.arrows[i].position.x = -0.05;
			if(i == 2) this.arrows[i].position.x = -0.03;
			this.arrows[i].position.y = -0.3;
			this.arrows[i].rotation.y = -Math.PI;
			this.characters[i].mesh.add(this.arrows[i]);
			
			//arrow animation
			TweenMax.to(this.arrows[i].position, 1,{ y : -0.05, delay: i * 0.3,
				onComplete:function(){
					if(i == 3) {
						scope.arrows.forEach((item) => {
							TweenMax.to(item.position, .5, { y : -0.03, repeat:-1, yoyo : true});
						});
					}
				}
			});
			TweenMax.to(this.arrows[i].rotation, 1,{ y : 0, delay: i * 0.3});
		}
		
		//add stage
		const stage = new Stage(0xffffff);
		stage.position.y = -0.2;
		stage.material.transparent = true;
		stage.material.opacity = 0.2;
		this.add(stage);
		//add light
		const ambient = new THREE.AmbientLight(0X222222);
		this.add(ambient);
		
		this.initUI(socket);
		
		const title = document.getElementById('title');
		title.style.display = 'block';
		TweenMax.to(title, {css: { opacity: 0}});
		
	}
	
	addEvent(world,socket) {
		const scope = this;
		this.event = new Util.event(world.scene,world.camera);
		this.event.on('click', this.raby.mesh, chooseRaby);
		this.event.on('click', this.robo.mesh, chooseRobo);
		this.event.on('click', this.rose.mesh, chooseRose);
		this.event.on('click', this.boy.mesh, chooseBoy);
		
		this.event.on('touchstart', this.raby.mesh, chooseRaby);
		this.event.on('touchstart', this.robo.mesh, chooseRobo);
		this.event.on('touchstart', this.rose.mesh, chooseRose);
		this.event.on('touchstart', this.boy.mesh, chooseBoy);
		
		function chooseRaby() {
			scope.rose.idle();
			scope.robo.idle();
			scope.boy.idle();
			scope.raby.dance();
			changeTitle(
				'黑白兔Raby，能够进入幽灵形态.确定选择她吗？','raby',socket
			)
		}
		function chooseRobo() {
			scope.raby.idle();
			scope.rose.idle();
			scope.boy.idle();
			scope.robo.dance();
			changeTitle(
				'机器人Roby,能够连续发射子弹.确定选择他吗？','robo',socket
			)
		}
		function chooseRose() {
			scope.raby.idle();
			scope.robo.idle();
			scope.boy.idle();
			scope.rose.dance();
			changeTitle(
				'少女Rose,能够发射散弹.确定选择她吗？','rose',socket
			)
		}
		function chooseBoy() {
			scope.raby.idle();
			scope.rose.idle();
			scope.robo.idle();
			scope.boy.dance();
			changeTitle(
				'少年Bob,能够发射回旋镖.确定选择他吗？','boy',socket
			)
		}
		
		function changeTitle(characterInfo,characterName,socket) {
			const title = document.getElementById('title');
			title.childNodes[0].data = characterInfo;
			const yes = document.getElementById('yes');
			yes.style.display = 'block';
			
			yes.onclick = function() {
				title.style.display = 'none';
				Emitter.emit('gamestart',characterName);
				socket.emit('addPlayer',characterName);
			}
			yes.ontouchstart = function() {
				title.style.display = 'none';
				Emitter.emit('gamestart',characterName);
				socket.emit('addPlayer',characterName);
			}
		}
		
	}
	
	initUI(socket) {
		
		const title = document.createElement('div');
		title.setAttribute('id','title');
		title.innerHTML = '选择你的角色吧!';
		document.body.appendChild(title);
		const yes = document.createElement('div');
		yes.setAttribute('id','yes');
		yes.innerHTML = 'yes';
		title.appendChild(yes);
	}
	
	animate() {
		for(let i = 0; i < 4; i++) {
			this.characters[i].animate();
		}
	}
	
	dispose(world) {
		Util.disposeHierarchy(world.scene);
		if(this.event) this.event.destroy();
	}



	
}

export default SelectScene;
