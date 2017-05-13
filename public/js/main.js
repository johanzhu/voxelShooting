'use strict';

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.z = 10;
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true
});

var container = document.getElementById('world');
container.appendChild(renderer.domElement);

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('load', onWindowResize, false);

function onWindowResize() {
	var WIDTH = window.innerWidth;
	var HEIGHT = window.innerHeight;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 10);

var cube = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({ color: 0xff0000 }));

var axis = new THREE.AxisHelper(5);

scene.add(cube);
scene.add(axis);
scene.add(light);

animate();

function animate() {
	requestAnimationFrame(animate);
	cube.rotation.x += Math.PI / 1200;
	cube.rotation.y += Math.PI / 1200;
	cube.rotation.z += Math.PI / 1200;
	render();
}
function render() {
	renderer.render(scene, camera);
}