
import * as THREE from 'three';

THREE.util = {
	
	/**
	 * @param {Object} mesh　needs to morph
	 * @param {Object} index of target vertex　
	 */
	getMorphValue :　
	
	function getMorphValue(mesh,index) {

		var morphTargets = mesh.geometry.morphTargets;
		var morphInfluences = mesh.morphTargetInfluences;
	
		var vA = new THREE.Vector3();
		var tempA = new THREE.Vector3();
	
		var fvA = mesh.geometry.vertices[ index ]; // the vertex to transform
		
		for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {
	
			var influence = morphInfluences[ t ];
	
			if ( influence === 0 ) continue;
	
			var targets = morphTargets[ t ].vertices;
	
			vA.addScaledVector( tempA.subVectors( targets[ index ], fvA ), influence );
	
		}
	
		vA.add( fvA ); // the transformed value
	
		return vA;
			
	}, 
	
	
  	/**
  	 * @param {Object} geometry: target geometry
  	 * @param {Object} face: target face
  	 * @param {Object} v : centroid vertex
  	 */
  	getFaceCentroid:
  
  	function(geometry, face, v) {
  	
	    var a = geometry.vertices[face.a];
	    var b = geometry.vertices[face.b];
	    var c = geometry.vertices[face.c];
	
	    v = v || new THREE.Vector3();
	
	    v.x = (a.x + b.x + c.x) / 3;
	    v.y = (a.y + b.y + c.y) / 3;
	    v.z = (a.z + b.z + c.z) / 3;
	
	    return v;
    
  	},
  	
  	/**
  	 * @param {Object} mesh: target mesh
  	 */
  	getCentroid: 
  	
  	function (obj) {
  		
  		var boundingBox;
  		
		if( obj instanceof THREE.Mesh) {
			
			obj.geometry.computeBoundingBox();
	
			boundingBox = obj.geometry.boundingBox;
	
		}else if(obj instanceof THREE.Object3D || obj instanceof THREE.Group) {
			
			boundingBox = new THREE.Box3().setFromObject(obj); 
			
		}
		
		var x0 = boundingBox.min.x;
	
		var x1 = boundingBox.max.x;

		var y0 = boundingBox.min.y;

		var y1 = boundingBox.max.y;

		var z0 = boundingBox.min.z;

		var z1 = boundingBox.max.z;

		var bWidth = ( x0 > x1 ) ? x0 - x1 : x1 - x0;

		var bHeight = ( y0 > y1 ) ? y0 - y1 : y1 - y0;

		var bDepth = ( z0 > z1 ) ? z0 - z1 : z1 - z0;

		var centroidX = x0 + ( bWidth / 2 ) + obj.position.x;

		var centroidY = y0 + ( bHeight / 2 ) + obj.position.y;

		var centroidZ = z0 + ( bDepth / 2 ) + obj.position.z;

		return {x: centroidX, y: centroidY, z: centroidZ};
		
	},
	
	/**
	 * @param {Object} node: dispose target
	 */
	disposeHierarchy : 
	
	function(node) {
		if( node ){
			for (var i = node.children.length - 1; i >= 0; i--) {
		        var child = node.children[i];
		        this.disposeHierarchy(child);
		        this.disposeNode(child);
	        }
		}
	},
	
	
	/**
	 * @param {Object} node: dispose target
	 */
	disposeNode : function(node) {
		
	    if (node instanceof THREE.Mesh) {
	        if (node.geometry) {
	        	if(node.geometry.prefabGeometry){
	        		console.warn('Bas geo exsist.')
	        		node.geometry.prefabGeometry.dispose();
	        	}
	            node.geometry.dispose ();
	        }
	
	        if (node.material) {
	            if (node.material instanceof THREE.MeshFaceMaterial) {
	                node.material.materials.forEach(function (mtrl) {
	                    if (mtrl.map)           mtrl.map.dispose ();
	                    if (mtrl.lightMap)      mtrl.lightMap.dispose ();
	                    if (mtrl.bumpMap)       mtrl.bumpMap.dispose ();
	                    if (mtrl.normalMap)     mtrl.normalMap.dispose ();
	                    if (mtrl.specularMap)   mtrl.specularMap.dispose ();
	                    if (mtrl.envMap)        mtrl.envMap.dispose ();
	
	                    mtrl.dispose ();    // disposes any programs associated with the material
	                });
	            } else {
	                if (node.material.map)          node.material.map.dispose ();
	                if (node.material.lightMap)     node.material.lightMap.dispose ();
	                if (node.material.bumpMap)      node.material.bumpMap.dispose ();
	                if (node.material.normalMap)    node.material.normalMap.dispose ();
	                if (node.material.specularMap)  node.material.specularMap.dispose ();
	                if (node.material.envMap)       node.material.envMap.dispose ();
	
	                node.material.dispose ();   // disposes any programs associated with the material
	            }
	        }
	    }
	},
	
	/**
	 * @param {Object} worldVector: Position vector of you object3D
	 * @param {Object} camera: main camera
	 * @param {Object} renderer : renderer
	 */
	toScreenXY : 
	
	function (worldVector,camera,renderer) {
	    var vector = worldVector.unproject(camera);
	    var result = {};
	    var halfWidth = renderer.domElement.width / 2;
		var halfHeight = renderer.domElement.height / 2;
	    result.x = Math.round(vector.x * halfWidth + halfWidth),
	    result.y = Math.round(-vector.y * halfHeight + halfHeight)
	
	    return result;
	},
	
	/**
	 * @param {Object} object: Your three.js obj3d
	 * @param {Object} camera: You main camera
	 */
	projectOnScreen : 
	
	function(object, camera) {
		var mat = new THREE.Matrix4();
		mat.multiply( camera.matrixWorldInverse, object.matrixWorld);
		mat.multiply( camera.projectionMatrix , mat);
	
		var c = mat.n44;
		var lPos = new THREE.Vector3(mat.n14/c, mat.n24/c, mat.n34/c);
		lPos.multiplyScalar(0.5);
		lPos.addScalar(0.5);
		return lPos;
	
	}
	
}//util end

/**
 * @param {Object} scene: You mesh's parent
 * @param {Object} camera: main camera
 * @param {Object} domElement: domElement
 */
THREE.util.event = function( scene, camera, domElement ) {
	
		window.ontouchstart = function(e) {
		    e.preventDefault(); 
		};
		
		var scope = this;
		
		this._domElement = domElement || document;
		
		
		this._target = null;
		
		this.scene = scene;
		this.camera = camera;
		
		this._$onClick = function(e) { scope._onClick(e); }
		this._$onMove = function(e) { scope._onMove(e); }
		this._$onTouchMove = function(e) { scope._onTouchMove(e); }
		this._$onMouseDown = function(e) { scope._onMouseDown(e); }
		this._$onMouseUp = function(e) { scope._onMouseUp(e); }
		this._$onTouchStart = function(e) { scope._onTouchStart(e); }
		this._$onTouchEnd = function(e) { scope._onTouchEnd(e); }
		
		this._domElement.addEventListener('click', this._$onClick , false );
		this._domElement.addEventListener('mousemove', this._$onMove, false );
		this._domElement.addEventListener('touchmove', this._$onTouchMove, false );
		this._domElement.addEventListener('mousedown', this._$onMouseDown, false );
		this._domElement.addEventListener('mouseup', this._$onMouseUp, false );
		this._domElement.addEventListener('touchstart', this._$onTouchStart, false );
		this._domElement.addEventListener('touchend', this._$onTouchEnd, false );
		
}

THREE.util.event.prototype.destroy	= function() {
	
	this._domElement.removeEventListener( 'click'		, this._$onClick	, false );
	this._domElement.removeEventListener( 'mousemove'	, this._$onMouseMove	, false );
	this._domElement.removeEventListener( 'mousedown'	, this._$onMouseDown	, false );
	this._domElement.removeEventListener( 'mouseup'		, this._$onMouseUp	, false );
	this._domElement.removeEventListener( 'touchmove'	, this._$onTouchMove	, false );
	this._domElement.removeEventListener( 'touchstart'	, this._$onTouchStart	, false );
	this._domElement.removeEventListener( 'touchend'	, this._$onTouchEnd	, false );
	
}

THREE.util.event.prototype.eventNames = [
	"click",
	"mouseover",
	"mouseout",
	"mousemove",
	"mousedown",
	"mouseup",
	"touchstart",
	"touchend"
];

THREE.util.event.prototype.on = function(eventType, target, callback ) {
	
	var typeExsist =  this.eventNames.some(function(eventName) {
		return eventName === eventType;
	});
	
	if(!typeExsist) {
		console.error('Invalid eventType !');
	}
	
	this._addCallback(eventType,target,callback);
	
}

THREE.util.event.prototype.off = function( eventType, target, callback ) {
	var scope = this;
	var typeExsist =  this.eventNames.some(function(eventName) {
		return eventName === eventType;
    });

    if(!typeExsist) {
		console.error('Invalid eventType !');
    }

	var hasThisEvent = !!target.userData[eventType];
	
    if(hasThisEvent) {
    	
    	var hasThisCallback = target.userData[eventType].callbacks.some(function(item) {
			return item === callback;
		}); 
		
		var targetCallbacks = target.userData[eventType].callbacks;
		
		if(hasThisCallback) {
		
	    	for(var i = 0 ; i < targetCallbacks.length; i++) {
			    if(targetCallbacks[i] == callback) {
			      targetCallbacks.splice(i, 1);
			      break;
			    }
		    }
    	}
    	
    }
  
  
}

THREE.util.event.prototype._addCallback = function(eventType,target,callback) {
	var scope = this;
		
	var haveThisType = !!target.userData[eventType];
	
	if(!haveThisType) {
		
		target.userData[eventType] = {
			callbacks: [callback],
			eventTarget: target
		}
	}else{
		target.userData[eventType].callbacks.push(callback);
	}
	
	
}

THREE.util.event.prototype.getMousePos = function( event ) {
	var mouse = {};
	mouse.x	= +(event.pageX / window.innerWidth ) * 2 - 1;
	mouse.y = -(event.pageY / window.innerHeight) * 2 + 1;
	return mouse;
}

THREE.util.event.prototype.getTouchPos = function( event ) {
	var mouse = {};
	mouse.x	= +(event.touches[0].pageX / window.innerWidth ) * 2 - 1;
	mouse.y = -(event.touches[0].pageY / window.innerHeight) * 2 + 1;
	return mouse;
}

THREE.util.event.prototype.getTouchEndPos = function( event ) {
	var mouse = {};
	mouse.x	= +(event.changedTouches[0].pageX / window.innerWidth ) * 2 - 1;
	mouse.y = -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;
	return mouse;
}

THREE.util.event.prototype._onClick = function(e) {
	var pos = this.getMousePos(e);
	this._onMouse(e.type,pos.x,pos.y);
};
			
THREE.util.event.prototype._onMouseDown = function(e) {
	var pos = this.getMousePos(e);
	this._onMouse(e.type,pos.x,pos.y);
}
			
THREE.util.event.prototype._onMouseUp = function(e) {
	var pos = this.getMousePos(e);
	this._onMouse(e.type,pos.x,pos.y);
}

THREE.util.event.prototype._onTouchStart = function(e) {
	var pos = this.getTouchPos(e);
	this._onMouse(e.type,pos.x,pos.y);
};

THREE.util.event.prototype._onTouchEnd = function(e) {
	var pos = this.getTouchEndPos(e);
	this._onMouse(e.type,pos.x,pos.y);
}

THREE.util.event.prototype._onMove = function(e) {
	var scope = this;
	
	var pos = this.getMousePos(e);
	var mouse = new THREE.Vector2();
	mouse.set(pos.x,pos.y);
	
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, this.camera );
	
	var intersects = raycaster.intersectObjects( this.scene.children, true );
	
	var oldTarget = this._target;//null
	
	var foundSomething = !!intersects.length;
	
	if(foundSomething) {
		
		var newTarget = intersects[0].object;
		
		this._target = newTarget;
		
		this._passParam( 'mousemove' , newTarget );
		
		if( oldTarget != newTarget ) {
			
			this._passParam( 'mouseover' , newTarget );
			oldTarget &&  this._passParam( 'mouseout' , oldTarget );
			
		}
	}else{
		
		oldTarget && this._passParam( 'mouseout' , oldTarget );
		this._target = null;
			
	}
}

THREE.util.event.prototype._onTouchMove = function(e) {
	var scope = this;
	
	var pos = this.getTouchPos(e);
	var mouse = new THREE.Vector2();
	mouse.set(pos.x,pos.y);
	
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, this.camera );
	
	var intersects = raycaster.intersectObjects( this.scene.children, true );
	
	var oldTarget = this._target;//null
	
	var foundSomething = !!intersects.length;
	
	if(foundSomething) {
		
		var newTarget = intersects[0].object;
		
		this._target = newTarget;
		
		this._passParam( 'touchmove' , newTarget );
		
		if( oldTarget != newTarget ) {
			
			this._passParam( 'mouseover' , newTarget );
			oldTarget &&  this._passParam( 'mouseout' , oldTarget );
			
		}
	}else{
		
		oldTarget && this._passParam( 'mouseout' , oldTarget );
		this._target = null;
			
	}
	
}


THREE.util.event.prototype._onMouse = function( eventType , mouseX, mouseY ) {
	
	var scope = this;
	
	var mouse = new THREE.Vector2();
	mouse.set(mouseX,mouseY);
	
	var raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, this.camera );
	
	var intersects = raycaster.intersectObjects( this.scene.children, true );
	
	var foundSomething = !!intersects.length;
	
	if( foundSomething ) {
		
		var intersectingTarget = intersects[0].object;
		
		var hasBindThisEvent = !!intersectingTarget.userData[eventType];
		
		if(hasBindThisEvent) {
			
			var targetMatch = ( intersectingTarget.userData[eventType].eventTarget === intersectingTarget );
			
			if(targetMatch) this._passParam( event.type, intersectingTarget );
			
		}
		
	}
}

THREE.util.event.prototype._passParam = function( eventType , intersectingTarget ) {
	
	var scope = this;
	var hasHandler = intersectingTarget.userData[eventType];
	if(hasHandler) {
		var handlers = intersectingTarget.userData[eventType].callbacks;
	 	
		for(var i = 0; i < handlers.length; i++){
		
			var handler	= handlers[i];
		
			handler(intersectingTarget);
		
		}
	}
}

THREE.util.CameraRotator = function() {
		
		this.transformTween;
		this.rotateTween;
		
}

THREE.util.CameraRotator.prototype = {
	
	constructor: THREE.util.CameraRotator,
	
	moveAndLookAt: function(camera, dstpos, dstlookat, options) {
		
		var scope = this;
		options || (options = {duration: 3000,delay:0});

  		var origpos = new THREE.Vector3().copy(camera.position);
  		var origrot = new THREE.Euler().copy(camera.rotation);

  		camera.position.set(dstpos.x, dstpos.y, dstpos.z);
  		camera.lookAt(dstlookat);
  		var dstrot = new THREE.Euler().copy(camera.rotation);
		
  		camera.position.set(origpos.x, origpos.y, origpos.z);
  		camera.rotation.set(origrot.x, origrot.y, origrot.z);
  		
  		scope.TransformTween = new TWEEN.Tween(camera.position).to({
    	x: dstpos.x,
    	y: dstpos.y,
    	z: dstpos.z
  		}, options.duration).delay(options.delay);
  
    	var qa = camera.quaternion; 
    	var qb = new THREE.Quaternion().setFromEuler(dstrot);
    	var qm = new THREE.Quaternion();
    	camera.quaternion = qm;
    
    	var o = {t: 0};
    	
    	scope.rotateTween = new TWEEN.Tween(o).to({t: 0.3}, options.duration).onUpdate(function () {
      		THREE.Quaternion.slerp(qa, qb, qm, o.t);
      		camera.quaternion.set(qm.x, qm.y, qm.z, qm.w);
    	},options.duration).delay(options.delay);
  		
  		scope.TransformTween.onStart(function(){
  			rotateTween.start();
  		});
  		
 	  } 
 	  
}


export default THREE.util;
