import * as THREE from 'three';
import Character from './character';
import Stage from './stage';
import { TweenMax } from 'gsap';
import Util from './util';

class GameScene extends THREE.Scene {
	constructor(preloader) {
		super();
		
	}
	
	init() {
		this.add(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.1),new THREE.MeshBasicMaterial()));
		
	}
	
	
	
	animate() {
		
	}
	
	dispose() {
		
	}



	
}

export default GameScene;
