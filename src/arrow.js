import * as THREE from 'three';

class Arrow extends THREE.Mesh{
	constructor() {
		super();
		this.arrowShape = new THREE.Shape();
	    this.arrowShape.moveTo(0,0);
	    this.arrowShape.lineTo(-2.5,-4.325);
	    this.arrowShape.lineTo(0,-2.1);
	    this.arrowShape.lineTo(2.5,-4.325);
	    this.arrowShape.lineTo(0,0);
		  var options = {
		  	amount: 2,
		  	bevelThickness: 0,
		  	bevelSize: 1,
		  	bevelSegments: 3,
		  	curveSegments: 12,
		  	step: 1
		  };
		this.geometry = new THREE.ExtrudeGeometry(this.arrowShape,options);
		this.material = new THREE.MeshLambertMaterial({color:0xffffff});
		this.scale.set(0.01,0.01,0.01);
		
	}
	
}

export default Arrow;
