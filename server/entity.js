
class Entity {
	constructor(socket) {
		this.id = socket.id;
		this.position = {
			x : 0,
			y : 0,
			z : 0
		};
	}
	
	update() {
		this.updatePosition();
	}
	
	updatePosition() {
		//todo
	}
	
	getDistance(target) {
		//todo
		return Math.sqrt(Math.pow(this.x-target.x,2) + Math.pow(this.y-target.y,2));
	}
	
}

export default Entity;
