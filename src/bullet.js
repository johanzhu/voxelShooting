import * as THREE from 'three';
import { TweenMax , Linear } from 'gsap';
import Util from './util';

class Bullet extends THREE.Object3D {
	
	constructor(data) {
		super();
		this.characterName = data.characterName;
		this.pos = data.position;
		
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
	
	update(distance,duration,world,socket,characterMesh,isBoy) {
		const scope = this;
		if(isBoy)
		TweenMax.to(scope.position, duration,{
			ease: Linear.noEase,
			bezier:[{z:distance},{z:-0.02}],
			onUpdate: function() {
				scope.children[0].rotation.y += Math.PI/6;
				scope.cast(world,socket,0);
			},
			onComplete: function() {
				scope.position.z = -0.02;
				characterMesh.remove(scope);
			}
		});
		else
		TweenMax.to(scope.position, duration,{
			ease: Linear.noEase,
			z : distance,
			onUpdate: function() {
				scope.children[0].rotation.z += Math.PI/12;
				scope.cast(world,socket,0);			
			},
			onComplete: function() {
				scope.position.z = 0;
				characterMesh.remove(scope);
			}
		});
		function toRad(deg){
			return (deg/180)*Math.PI;
		}
	}
	
	updateForRose(distance,duration,world,socket,characterMesh) {
		const scope = this;
		TweenMax.to(scope.children[0].position, duration,{
			ease: Linear.noEase,
			z : distance,
			onUpdate: function() {
				scope.castForRose(world,socket,0);				
			},
			onComplete: function() {
				scope.children[0].position.z = 0;
				characterMesh.remove(scope);
			}
		});
		TweenMax.to(scope.children[1].position, duration,{
			ease: Linear.noEase,
			z : distance * Math.sin(Math.PI/6),
			x : distance * Math.cos(Math.PI/3),
			onUpdate: function() {
				scope.castForRose(world,socket,1);				
			},
			onComplete: function() {
				scope.children[1].position.z = 0;
				scope.children[1].position.x = 0;
				characterMesh.remove(scope);
			}
		});
		TweenMax.to(scope.children[2].position, duration,{
			ease: Linear.noEase,
			z : distance * Math.sin(Math.PI/6),
			x : - distance * Math.cos(-Math.PI/3),
			onUpdate: function() {
				scope.castForRose(world,socket,2);
			},
			onComplete: function() {
				scope.children[2].position.z = 0;
				scope.children[2].position.x = 0;
				characterMesh.remove(scope);
			}
		});
		
	}
	
	cast(world,socket,id) {
		const vector = this.getWorldPos(world,this,id);
		const raycaster = new THREE.Raycaster(vector,new THREE.Vector3(0,1,0));
		const collide = raycaster.intersectObjects(world.scene.children,true);
		const hit = collide.length;
		if(hit) this.handleCollide(collide,world,socket);
	}
	
	castForRose(world,socket,id) {
		const vector = this.getWorldPos(world,this,id);
		const raycaster = new THREE.Raycaster(vector,new THREE.Vector3(0,1,0));
		const collide = raycaster.intersectObjects(world.scene.children,true);
		const hit = collide.length;
		if(hit) this.handleCollideForRose(collide,world,socket);
	}
	
	getWorldPos(world,parent,id) {
		world.scene.updateMatrixWorld();
		parent.updateMatrixWorld();
		const vector = new THREE.Vector3();
		vector.setFromMatrixPosition( parent.children[id].matrixWorld );
		return vector;
	}
	
	handleCollide(collide,world,socket) {
		collide.forEach(( hitItem ) => {
			if(hitItem.object instanceof THREE.SkinnedMesh) {
				console.log(hitItem.object.name);
				if(hitItem.object.userData.hp <= 0) {
					world.scene.remove(hitItem.object);
					Util.disposeHierarchy(hitItem.object);
				}
				socket.emit('updateHP',hitItem.object.userData.id);
			}
		});
	}
	
	handleCollideForRose(collide,world,socket) {
		collide.forEach(( hitItem ) => {
			if(hitItem.object instanceof THREE.SkinnedMesh && hitItem.object.name !== 'rose') {
				console.log(hitItem.object.name);
				if(hitItem.object.userData.hp <= 0) {
					world.scene.remove(hitItem.object);
					Util.disposeHierarchy(hitItem.object);
				}
				socket.emit('updateHP',hitItem.object.userData.id);
			}
		});
	}	
		
	
	animate(world,socket,characterMesh) {
		switch(this.characterName) {
			case 'raby':
				this.update(1.2,1.3,world,socket,characterMesh);
			break;
			case 'robo':
				this.update(1.0,0.22,world,socket,characterMesh);
			break;
			case 'rose':
				this.updateForRose(1.5,2.2,world,socket,characterMesh);
			break;
			case 'boy':
				this.update(1.1,1.2,world,socket,characterMesh,true);
			break;	
			default:
			break;
		}
	
	}
	
}
	
export default Bullet;