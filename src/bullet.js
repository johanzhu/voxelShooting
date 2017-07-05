import * as THREE from 'three';

class Bullet extends THREE.Object3D {
	
	constructor(data) {
		this.characterName = data.characterName;
		this.position = data.position;
		switch(this.characterName) {
			case 'raby':
				const rabyBullet = new THREE.Mesh(
					new THREE.BoxGeometry(0.05,0.005,0.05),
					new THREE.MeshLambertMaterial({color:0x010116)})
				);
				this.add(rabyBullet);
				this.name = 'rabyBullet';
				break;
				case 'robo':
				
				break;
				case 'rose':
				
				break;
				
				return new C
			
			
		}
	}
	
	
	
}
