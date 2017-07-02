import * as THREE from 'three';
import Character from './character';
import Util from './util';

class Player {
	constructor(data,preloader){
		this.id = data.id;
		this.hp = data.hp
		this.hpMax = data.hpMax;
		this.position = data.position;
		this.angle = data.angle;
		this.characterName = data.characterName;
		
		this.character = (function(data) {
			switch(data.characterName) {
				case 'raby':
				return new Character(preloader.getResult('raby'),data,false);
				break;
				case 'robo':
				return new Character(preloader.getResult('robo'),data,false);
				break;
				case 'rose':
				return new Character(preloader.getResult('rose'),data,false);
				break;
				case 'boy':
				return new Character(preloader.getResult('boy'),data,false);
			}
		})(data);
		
		this.camera  = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000);
		this.characterPos = {
			x : this.position.x,
			y : this.position.y,
			z : this.position.z,
		};
		this.camera.position.set(
			this.characterPos.x,
			this.characterPos.y + 0.8,
			this.characterPos.z + 1,
		);
		this.camera.lookAt(this.characterPos);
		
	}
	
	addToScene(world) {
		
		this.character.mesh.position.set(this.position.x,this.position.y,this.position.z);
		world.scene.add(this.character.mesh);
		
	}
	
	animateCamera() {
		this.characterPos = {
			x : this.position.x,
			y : this.position.y,
			z : this.position.z,
		};
		this.camera.position.set(
			this.characterPos.x,
			this.characterPos.y + 0.8,
			this.characterPos.z + 1,
		);
		this.camera.lookAt(this.characterPos);
	}
	
	animate(data) {
		this.character.animate(data);
		this.animateCamera();
	}
	
	
}

export default Player;
