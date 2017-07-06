import Util from './util';
import * as THREE from 'three';
class HPBar {
	constructor(hp,hpMax,id) {
		this.hp = hp;
		this.hpMax = hpMax;
		this.id = id.toString().slice(2);
		this.playerHP = document.createElement('div');
		this.playerHP.setAttribute('id',this.id);
		this.playerHP.style.position = 'absolute';
		this.playerHP.style.width = '50px';
		this.playerHP.style.height = '10px';
		this.playerHP.setAttribute('class','playerHP');
		this.hpBox = document.createElement('div');
		this.hpBox.setAttribute('class','hpBox');
		this.hp = document.createElement('div');
		this.hp.setAttribute('class','hp');
	}
	
	init(position,world) {
		const vector = new THREE.Vector3(
			position.x,
			position.y,
			position.z
		);
		const coord = Util.toScreenXY(vector,world.camera,world.renderer);
		console.log(coord);
		this.playerHP.style.left = coord.x + 'px';
		this.playerHP.style.top = coord.y + 'px';
		document.body.appendChild(this.playerHP);
		this.playerHP.appendChild(this.hpBox);
		this.hpBox.appendChild(this.hp);
	}
	updateHp(hp,position,world) {
		const vector = new THREE.Vector3(
			position.x,
			position.y,
			position.z
		);
		const coord = Util.toScreenXY(vector,world.camera,world.renderer);
		console.log(coord);
		this.playerHP.style.left = coord.x + 'px';
		this.playerHP.style.top = coord.y + 'px';
		this.playerHP.children[0].children[0].width = hp + 'px';
	}
	
	dispose() {
		document.body.removeChild(this.playerHP);
	}
	
}

export default HPBar;
