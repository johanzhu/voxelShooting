import * as THREE from 'three';

class Character {
	
	constructor(json) {
		this.modelFile = json;
	}
	
	this._geometry = this.modelFile.geometry;
	this._material = this.modelFile.materials[0];
	
	this.mesh = new THREE.SkinnedMesh(
		this._geometry,
		this._material
	);
	
}

export default Character;
