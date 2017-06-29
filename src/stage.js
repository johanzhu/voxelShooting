import * as THREE from 'three';

class Stage extends THREE.Mesh{
	
	constructor(color) {
		super();
		this.texture = new THREE.TextureLoader().load('/model/wood.png');
		this.geometry = new THREE.PlaneGeometry(500,500,20,20);
		this.material = new THREE.MeshLambertMaterial({color:color,map:this.texture});
		this.receiveShadow = true;
		this.rotation.x = -Math.PI/2;
	}
	
}

export default Stage;