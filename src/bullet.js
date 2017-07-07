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
		this.pos = data.position;
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
				const pos = new THREE.Vector3(this.pos.x,this.pos.y,this.pos.z);
				console.log(pos);
				this.raycaster = new THREE.Raycaster( pos.add(new THREE.Vector3(-0.025,0.12,0.13)) ,new THREE.Vector3(0,-1,0),0,0.025);
				const arrowHelper = new THREE.ArrowHelper( new THREE.Vector3(0,0,1), new THREE.Vector3(0.025,0,0), 0.5, 0xff0000 );
				rabyBullet.add( arrowHelper );
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
	
	update(distance,duration,world,isBoy) {
		const scope = this;
		TweenMax.to(scope.position, duration,{
			z : distance,
			onUpdate: function() {
				const collide = scope.raycaster.intersectObjects(world.scene.children);
				if(collide.length) console.log(collide);
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
			z : distance * Math.sin(Math.PI/6),
			x : distance * Math.cos(Math.PI/3)
		});
		TweenMax.to(scope.children[2].position, duration,{
			z : distance * Math.sin(Math.PI/6),
			x : - distance * Math.cos(-Math.PI/3)
		});
		
	}
	
	animate(world) {
		switch(this.characterName) {
			case 'raby':
				this.update(0.7,1.3,world);
			break;
			case 'robo':
				this.update(0.3,0.22,world);
			break;
			case 'rose':
				this.updateForRose(1.5,2.2)
			break;
			case 'boy':
				this.update(0.6,1.2,world,true);
			break;	
			default:
			break;
		}
	
	}
	
}
	
export default Bullet;