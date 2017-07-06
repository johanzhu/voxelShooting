import * as THREE from 'three';
import { TweenMax } from 'gsap';
import Util from './util';

class Bullet extends THREE.Object3D {
	
	constructor(data) {
		super();
		this.characterName = data.characterName;
		//we dont need position here, because when you add bullet to character ,position of bullet set to 0 0 0
		// so wo use relative coord to tween the position
		//this.position = data.position;
		this.angle = data.angle;
		this.deg = 0;
		switch(this.characterName) {
			case 'raby':
				const rabyBullet = new THREE.Mesh(
					new THREE.BoxGeometry(0.05,0.005,0.05),
					new THREE.MeshLambertMaterial({color:0x010116})
				);
				rabyBullet.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/4));
				rabyBullet.position.set(-0.025,0.12,0.13);
				this.add(rabyBullet);
				this.name = 'rabyBullet';
			break;
			case 'robo':
				const roboBullet = new THREE.Mesh(
				new THREE.OctahedronGeometry(0.02, 0),
				new THREE.MeshLambertMaterial({color:0Xf8ae2c})
				);
				roboBullet.position.set(-0.05,0.12,0.13);
				this.add(roboBullet);
				this.name = 'roboBullet';
			break;
			case 'rose':
				const roseBullet = new THREE.Mesh(
					new THREE.CylinderGeometry(0.01, 0.01, 0.05, 6, 1),
					new THREE.MeshLambertMaterial({color:0X6bFFFF})
				);
				roseBullet.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
				const roseBullet2 = roseBullet.clone();
				roseBullet2.rotation.y += Math.PI/6;
				const roseBullet3 = roseBullet.clone();
				roseBullet3.rotation.y -= Math.PI/6;
				roseBullet.position.set(-0.05,0.11,0.17);
				roseBullet2.position.set(-0.02,0.11,0.16);
				roseBullet3.position.set(-0.08,0.11,0.16);
				this.add(roseBullet);
			   	this.add(roseBullet2);
		   		this.add(roseBullet3);
		   		this.name = 'roseBullet';
			break;
			case 'boy':
				const shape = new THREE.Shape();
			    shape.moveTo(0,0);
			    shape.lineTo(-3.5,-3.325);
			    shape.lineTo(0,-1.9);
			    shape.lineTo(3.5,-3.325);
			    shape.lineTo(0,0);
				const geometry = new THREE.ShapeGeometry(shape);
				geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
				geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI));
				const material = new THREE.MeshBasicMaterial({color:0xFEE437});
				const boyBullet = new THREE.Mesh(geometry,material);
				boyBullet.scale.set(0.02,0.02,0.02);
				boyBullet.position.set(-0.05,0.12,0.15);
		   		this.add(boyBullet);
			break;	
			default:
			break;
		}
		
		
	}
	
	update(distance,duration,isBoy) {
		const scope = this;
		TweenMax.to(scope.position, duration,{
			z : distance,
			onUpdate: function() {
				if(isBoy) 
				scope.children[0].rotation.y += Math.PI/12;
				else
				scope.children[0].rotation.z += Math.PI/12;
			},
		});
		function toRad(deg){
			return (deg/180)*Math.PI;
		}
	}
	
	
	updateForRose(distance,duration) {
		const scope = this;
		TweenMax.to(scope.children[0].position, duration,{
			z : distance,
		});
		TweenMax.to(scope.children[1].position, duration,{
			z : distance * Math.sin(Math.PI/3),
			x : distance * Math.cos(Math.PI/6)
		});
		TweenMax.to(scope.children[2].position, duration,{
			z : distance * Math.sin(Math.PI/3),
			x : - distance * Math.cos(-Math.PI/6)
		});
		
	}
	
	animate() {
		switch(this.characterName) {
			case 'raby':
				this.update(0.6,1.9);
			break;
			case 'robo':
				this.update(0.3,0.22);
			break;
			case 'rose':
				this.updateForRose(0.6,1.5)
			break;
			case 'boy':
				this.update(0.5,1.86,true);
			break;	
			default:
			
			break;
		}
	
	}
	
}
	
export default Bullet;