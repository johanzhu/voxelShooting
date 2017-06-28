import * as THREE from 'three';
import Clock from './clock';

class Character {
	
	constructor(json) {
		this.loader = new THREE.JSONLoader();
		this.modelFile = this.loader.parse(json,'/model/');
		this.geometry = this.modelFile.geometry;
		this.material = this.modelFile.materials[0];
		this.material.skinning = true;
		this.mesh = new THREE.SkinnedMesh(
			this.geometry,
			this.material
		);
		this.mesh.castShadow = true;
		this.clock = new Clock(true);
		this.mixer = new THREE.AnimationMixer(this.mesh);
		
	}
	
	attack() {
		this.reset();
		this.mixer.clipAction(this.geometry.animations[0]).play();
	}
	
	idle() {
		this.reset();
		this.mixer.clipAction(this.geometry.animations[2]).play();
	}
	
	run() {
		this.reset();
		this.mixer.clipAction(this.geometry.animations[3]).play();
	}
	
	dance() {
		this.reset();
		this.mixer.clipAction(this.geometry.animations[1]).play();
	}
	
	reset() {
    	this.mixer.stopAllAction();
    	for( let i=0; i < this.mesh.geometry.animations.length; i++) {
    		this.mixer.clipAction( this.mesh.geometry.animations[i] ).reset();
    	}
	}
	
	animate() {
		this.mixer.update(this.clock.delta);
	}
	
}

export default Character;
