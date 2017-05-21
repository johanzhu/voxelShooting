import * as THREE from 'three';
import Character from './character';

class Archer extends Character {
	constructor(json) {
		super(json); 
		this.mixer = new THREE.AnimationMixer(this.mesh);
	}
	
	attack() {
		console.log('attack');
	}
	
	
	
	
	
}
