import * as THREE from 'three';
import Character from './character';

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
		
	}
	
	addToScene(world) {
		
		this.character.mesh.position.set(this.position.x,this.position.y,this.position.z);
		world.scene.add(this.character.mesh);
		
	}
	
	animate() {
		this.character.animate();
	}
	
	
}

export default Player;
