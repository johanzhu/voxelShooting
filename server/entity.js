
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
		console.log('entity 更新位置函数' + this.position);
	}
	
	getDistance() {
		//todo
		console.log('entity获取距离函数');
	}
	
}

export default Entity;
