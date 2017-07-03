import Entity from './entity';

class Player extends Entity {
	constructor(socket,characterName) {
		super(socket);
		this.characterName = characterName;
		this.hp = 100;
		this.hpMax = 100;
		this.move = false;
		this.angle = 0;
		this.attack = false;
		this.idle = true;
		this.run = false;
	}
	
	update() {
		super.update();
		if(this.move) {
			this.updateSpd();
		}
	}
	
	updateSpd() {
		const scope = this;
		const movingStep = 0.015;
		this.position.x += movingStep * Math.cos(toRad(scope.angle));
		this.position.z -= movingStep * Math.sin(toRad(scope.angle));
		function toRad(deg){
			return (deg/180) * Math.PI;
		} 
	}
	
	getInitPack() {
		return {
			id : this.id,
			characterName : this.characterName,
			hpMax : 100,
			position : { x:0, y:0, z:0},
			hp : 100,
			move : false,
			angle : 0,
			attack :false,
			idle : true,
			run : false
		}
	}
	
	getUpdatePack() {
		return {
			id:this.id,
			position : this.position,
			hp : this.hp,
			angle : this.angle,
			move : this.move,
			attack :this.attack,
			idle : this.idle,
			run : this.run
		}
	}
	
	getRemovePack() {
		//todo
	}
	
	static getAllInitPack(playerList) {
		var players = [];
		for(let i in playerList)
			players.push(playerList[i].getInitPack());
		return players;
	}
	
	static getAllUpdatePack(playerList) {
		var players = [];
		for(let i in playerList)
			players.push(playerList[i].getUpdatePack());
		return players;
	}
	
	onConnect(socket,playerList) {
		const scope = this;
		//server
		socket.on('rotate',function(angle){
			scope.angle = angle;
		});
		socket.on('run',function(isRun){
			scope.run = isRun;
		});
		
		socket.on('move',function() {
			scope.move = true;
		});
		
		socket.on('stop',function() {
			scope.move = false;
		});
		
		socket.on('attack',function(isAttack) {
			scope.attack = isAttack;
		});
		
		socket.on('idle',function(isIdle) {
			scope.idle = isIdle;
		});
		
		socket.on('gamestart',function() {
			console.log('gamestart');
		});
		
		const initPack = Player.getAllInitPack(playerList);
		socket.emit('init',
			initPack,
			socket.id
		);
		
	}
	
	onDisConnect(player,socket,removePack) {
		delete player.list[socket.id];
		removePack.player.push(socket.id);
	
	}
	
}


export default Player;
	
	
	//Player.list[self.id] = self;
	
	//initPack.player.push(self.getInitPack());
