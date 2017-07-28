import * as THREE from 'three';
import Clock from './clock';
import Bullet from './bullet';
import Util from './util';
import GlowShaderMaterial from './glowshadermaterial';

class Character {
	
	constructor(json,data,selectMode) {
		this.loader = new THREE.JSONLoader();
		this.modelFile = this.loader.parse(json,'/model/');
		this.geometry = this.modelFile.geometry;
		this.material = this.modelFile.materials[0];
		this.material.skinning = true;
		this.mesh = new THREE.SkinnedMesh(
			this.geometry,
			this.material
		);
		
		if(data) this.mesh.name = data.characterName;
		if(data) this.mesh.userData.hp = data.hp;
		if(data) this.mesh.userData.id = data.id;
		
		if(data && data.characterName == 'raby')
		this.vanishMat = GlowShaderMaterial();
		
		this.mesh.castShadow = true;
		this.clock = new Clock(true);
		
		this.mixer = new THREE.AnimationMixer(this.mesh);
		
		//action 
		this._attack = this.mixer.clipAction( this.geometry.animations[0] );
		this._attack.setLoop( THREE.LoopOnce );
		this._attack.clampWhenFinished = true;
		
		this._idle = this.mixer.clipAction(this.geometry.animations[2]);
		
		this._run = this.mixer.clipAction(this.geometry.animations[3]);
		
		this._dance = this.mixer.clipAction(this.geometry.animations[1]);
		
		//character action state
		if(data) this.angle = data.angle;
		
		if(data) this._$run = data.run;
		
		if(data) this._$attack = data.attack;
		
		if(data) this._$idle = data.idle;
		
		if(data) this._$vanish = data.vanish;
		
		if(data) this._$touch = data.touch;
		
		if(data) this.characterName = data.characterName;
		
		if(data) {
			const bullet = new Bullet(data);
			this.bullet = bullet;
		}
		
		this.attackFinished = true;
		this.attackDelay = 0;
		
		this.onSelect = selectMode;
		
	}
	
	attack(data,world,socket) {
		const scope = this;
		if(this._$attack) {
			if(this.attackFinished) {
				this.attackFinished = false;
				//of course is finished . you are not attacking anyone;
				this.reset();
				
				this._attack.play();
				
				switch(data.characterName) {
					case 'raby':
					this.attackDelay = 500;
					break;
					case 'robo':
					this.attackDelay = 0;
					break;
					case 'rose':
					this.attackDelay = 600;
					break;
					case 'boy':
					this.attackDelay = 500;
					break;
				}
				
				setTimeout(function() {
					scope.shoot(world,socket);
				},this.attackDelay);
				
				
				//fade the action
				this.mixer.addEventListener('finished',hanldeAttackFinish);
				
				function hanldeAttackFinish() {
					scope.attackFinished = true;
					
					if(data.touch) {
						socket.emit('move');
						scope.reset();
						scope._run.play();
						scope.mixer.removeEventListener('finished',hanldeAttackFinish);
					}else{
						socket.emit('stop');
						scope.reset();
						scope._idle.play();
						scope.mixer.removeEventListener('finished',hanldeAttackFinish);
					}
				}
				
				
				
			}
		}
	}
	
	shoot(world,socket) {
		this.mesh.add(this.bullet);
		this.bullet.animate(world,socket,this.mesh);
	}
	
	idle() {
		if(this.onSelect){
			this.reset();
			this._idle.play();
		}
		if(this.bullet) {
			this.mesh.remove(this.bullet);
		}
		if(this.attackFinished) {
			if(this._$idle) {
				this.reset();
				this._idle.play();
			}
		}
		
	}
	
	run() {
		if(this.bullet) {
			this.mesh.remove(this.bullet);
		}
		
		if(this.attackFinished && this._$run) {
			this.reset();
			this._run.play();
		}
	}
	
	dance() {
		//dance action has nothing to do with the server
		this.reset();
		this._dance.play();
		this._dance.crossFadeFrom(this._idle,0.15,true);
	}
	
	vanish() {
		this.mesh.material = this.vanishMat;
	}
	
	show() {
		this.mesh.material = this.material;
	}
	
	reset() {
    	this.mixer.stopAllAction();
    	for( let i=0; i < this.mesh.geometry.animations.length; i++) {
    		this.mixer.clipAction( this.mesh.geometry.animations[i] ).reset();
    	}
	}
	
	//character moving state
	rotate(data) {
		if(this.attackFinished) {
			const deg = data.angle;
			if(deg == 0) {
				this.mesh.rotation.y = 0;
			}else{
				this.mesh.rotation.y = toRad(deg + 90);
			}
		}
		
		function toRad(deg){
			return (deg/180)*Math.PI;
		}
	}
	
	updatePos(data) {
		if(this.attackFinished) {
			this.mesh.position.x = data.position.x;
			this.mesh.position.z = data.position.z;
		}
	}
	
	//action animate
	animate() {
		this.mixer.update(this.clock.delta);
	}
	
}

export default Character;
