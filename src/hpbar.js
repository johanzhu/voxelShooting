import * as THREE from 'three';

class HPBar extends THREE.Object3D{
	constructor(hp,hpMax) {
		super();
		this.hp = hp;
		this.hpMax = hpMax;
		const box = new THREE.Geometry();
		box.vertices.push(
			new THREE.Vector3(-0.04,0.015),
			new THREE.Vector3(0.04,0.015),
			new THREE.Vector3(0.04,-0.015),
			new THREE.Vector3(-0.04,-0.015)
		);	
		const lineMat = new THREE.LineBasicMaterial({color:0x000000});
		this.hpBox = new THREE.LineLoop(box,lineMat);
		this.hp = new THREE.Mesh(
			new THREE.PlaneGeometry(0.079,0.029),
			new THREE.MeshBasicMaterial({color:0xff0000,side:THREE.DoubleSide})
		);
		this.hp.scale.x = this.hp/this.hpMax;
		this.add(this.hpBox);
		this.add(this.hp);
	}
	
	
	update(hp) {
		this.hp.scale.x = hp/this.hpMax;
	}
	
}

export default HPBar;
