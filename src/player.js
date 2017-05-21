import * as THREE from 'three';

class Player {
	constructor(id,position,name){
		this.id = id;
		this.position = position;
		this.name = name;
		this.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(20),
			new THREE.MeshLambertMaterial({wireframe:true})
		)
	}
	
	
	
	
}

export default Player;
