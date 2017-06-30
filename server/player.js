import Entity from './entity';

class Player extends Entity {
	constructor(data,initPack) {
		super(data);
		this.hp = 100;
		this.hpMax = 100;
		this.isMoving = false;
		this.angle = 0;
		this.list[this.id] = this;
	}
	
	update() {
		//todo
		super.update();
		this.updateSpd();
	}
	
	updateSpd() {
		//todo
		console.log('player更新位置函数');
	}
	
	getInitPack() {
		return {
			id: this.id,
			position: this.position,
			hp: this.hp,
			hpMax: this.hpMax,
		}
	}
	
	getUpdatePack() {
		return {
			id: this.id,
			position: this.position,
			hp: this.hp
		}
	}
	
	getAllInitPack(player) {
		var players = [];
		for(let i in this.list)
			players.push(player.list[i].getInitPack());
		return players;
	}
	
	onConnect(socket,player) {
		socket.on('move',function(data){
			console.log(data);
		});
		
		socket.on('gamestart',function() {
			console.log('gamestart');
		});
		socket.emit('init',{
			id: socket.id,
			player: this.getAllInitPack(player)
		});
	}
	
	onDisConnect(player,socket,removePack) {
		delete player.list[socket.id];
		removePack.player.push(socket.id);
	
	}
	
}


export default Player;
	
	
	//Player.list[self.id] = self;
	
	//initPack.player.push(self.getInitPack());
