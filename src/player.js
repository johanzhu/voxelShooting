import * as THREE from 'three';

class Player {
	constructor(id,position){
		this.id = id;
		this.position = position;
		this.mesh = new THREE.Mesh(
			new THREE.SphereGeometry(3),
			new THREE.MeshPhongMaterial({color:0xf01f01,wireframe:true})
		);
	}
	
	
	sayHi(name) {
		console.log(`I'm player${this.id},position:${this.position}`);
	}
	
}

export default Player;
