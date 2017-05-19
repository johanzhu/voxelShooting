import * as THREE from 'three';

class World {
	constructor(scene,camera){
		if(scene && scene instanceof THREE.Scene)
			this.scene = scene;
		else
			this.scene = new THREE.Scene();
		if(camera && camera instanceof THREE.Camera)
			this.camera = camera;
		else 
			this.camera = new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,0.1,2000);
	}
	
	init() {
		const that = this;
		
		const world = document.createElement('div');
		world.setAttribute('id','world');
		document.body.appendChild(world);
	
   		this.camera.position.set(-5,10,45);
		this.camera.lookAt(new THREE.Vector3(0,0,0));
		
		this.renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
		this.renderer.setSize(window.innerWidth,window.innerHeight);
		this.renderer.setPixelRatio(1.5);
		this.renderer.shadowMap.enabled = true;
	
		var container =  document.getElementById('world');
		container.appendChild(this.renderer.domElement);
	
		window.addEventListener('resize',onWindowResize,false);
		window.addEventListener('load',onWindowResize,false);
	
		function onWindowResize(){
      		var WIDTH=window.innerWidth;
      		var HEIGHT=window.innerHeight;
      		that.renderer.setSize(WIDTH, HEIGHT);
      		that.camera.aspect = WIDTH / HEIGHT;
      		that.camera.updateProjectionMatrix();
    	}
	    
		this.axis = new THREE.AxisHelper(10);
		this.scene.add( this.axis );
		this.ambient = new THREE.AmbientLight( 0x444444 );
    	this.scene.add( this.ambient );
    
	}
	
	render() {
		this.renderer.render(this.scene,this.camera);
	}
		
	removeAxis() {
		this.scene.remove(this.axis);
	}
	
	changeScene(scene,camera) {
		this.scene = scene;
		this.camera = camera;
		const WIDTH=window.innerWidth;
      	const HEIGHT=window.innerHeight;
      	this.renderer.setSize(WIDTH, HEIGHT);
      	this.camera.aspect = WIDTH / HEIGHT;
      	this.camera.updateProjectionMatrix();
	}
	
}

export default World;


