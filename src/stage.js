import * as THREE from 'three';

class Stage {
	
	constructor(color) {
		this.geometry = new THREE.PlaneGeometry(500,500,20,20);
		this.material = new THREE.MeshLambertMaterial({color:color});
		this.mesh = new THREE.Mesh(this.geometry,this.material);
		this.mesh.receiveShadow = true;
		this.mesh.rotation.x = -Math.PI/2;
	}
	
}

export default Stage;