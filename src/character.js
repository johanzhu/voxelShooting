import * as THREE from 'three';
import Clock from './clock';

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
		
		if(data) this.position = data.position;
		
		if(data) this.move = data.move;
		
		this.onSelect = selectMode;
		
	}
	
	attack() {
		//get action state from server
		if(this._$attack) {
			
			this.reset();
			
			this._attack.play();
			
			//fade the action
			this.mixer.addEventListener('finished',() => {
				this._$attack = false;
				if(this._$run) {
					this._attack.crossFadeTo(this._run,0.15,true);
					this._run.play();
				}else{
					this._attack.crossFadeTo(this._idle,0.15,true);
					this._idle.play();
				}
				
			//shoot bullet todo
				//todo
				
			});
		}
	}
	
	idle() {
		if(this.onSelect){
			this.reset();
			this._idle.play();
		}
		if(this._$idle) {
			this.reset();
			this._idle.play();
		}
		
	}
	
	run() {
		
		if(this._$run) {
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
	
	reset() {
    	this.mixer.stopAllAction();
    	for( let i=0; i < this.mesh.geometry.animations.length; i++) {
    		this.mixer.clipAction( this.mesh.geometry.animations[i] ).reset();
    	}
	}
	
	//character moving state
	rotate(data) {
		
		const deg = data.angle;
		if(deg == 0) {
			this.mesh.rotation.y = 0;
		}else{
			this.mesh.rotation.y = toRad(deg - 270);
		}
		
		function toRad(deg){
			return (deg/180)*Math.PI;
		}
	}
	
	updatePos(data) {
		if(data.move) {
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
