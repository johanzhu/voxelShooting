import * as THREE from 'three';

class Stage extends THREE.Mesh{
	
	constructor(color) {
		super();
		this.geometry = new THREE.PlaneGeometry(500,500,100,100);
		this.material = new THREE.MeshLambertMaterial({color:color});
		this.receiveShadow = true;
		this.rotation.x = -Math.PI/2;
	}
	
}

export default Stage;