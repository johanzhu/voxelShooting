import * as THREE from 'three';
import Character from './character';
import Util from './util';

class Player {
	constructor(data,preloader,characterName){
		this.id = data.id;
		this.position = data.position;
		
		this.hp = data.hp;
		this.hpMax = data.hpMax;
		
		this.character = (function() {
			switch(characterName) {
				case 'raby':
				return new Character(preloader.getResult('raby')); 
				break;
				case 'robo':
				return new Character(preloader.getResult('robo'));
				break;
				case 'rose':
				return new Character(preloader.getResult('rose'));
				break;
				case 'boy':
				return new Character(preloader.getResult('boy'));
			}
		})();
		
		this.camera  = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000);
		this.characterPos = {
			x : this.character.mesh.position.x,
			y : this.character.mesh.position.y,
			z : this.character.mesh.position.z,
		};
		this.camera.position.set(
			this.characterPos.x,
			this.characterPos.y + 0.3,
			this.characterPos.z + 5,
		);
		this.camera.lookAt(this.characterPos);
		
	}
	
	addToScene(world) {
		
		this.character.mesh.position.set(this.position.x,this.position.y,this.position.z);
		world.scene.add(this.character.mesh);
		
	}
	
	animate() {
		this.character.animate();
		this.characterPos = {
			x : this.character.mesh.position.x,
			y : this.character.mesh.position.y,
			z : this.character.mesh.position.z,
		};
		this.camera.position.set(
			this.characterPos.x,
			this.characterPos.y + 0.5,
			this.characterPos.z + 1,
		);
		this.camera.lookAt(this.characterPos);
	}
	
	dispose() {
		Util.disposeHierarchy(this.character.mesh);
	}
	
	
}

export default Player;
