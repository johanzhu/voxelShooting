import nipplejs from 'nipplejs';
import Emitter from './emitter';
import { TweenMax } from 'gsap';

class Stick {
	construtor() {
		
	}
	
	init(socket) {
		const stickzone = document.getElementById('stickzone');
		const stick = nipplejs.create({
			zone: stickzone,
		    color: '#000', 
		    size: 100,
		    threshold: 0.1,              
		    fadeTime: 250,             
		    multitouch: false,
		    maxNumberOfNipples: 1,     
		    dataOnly: false,             
		    position: {bottom:'90px',left:'90px'},         
		    mode: 'static',                  
		    restOpacity: 0.5,
		});
		
		
	    stick.on('start move', function (evt,data) {
	    	//when start touch the stick and move stick pass the angle to server and change player data
	    	if(data.angle) {
	    		socket.emit('rotate',data.angle.degree);
	    	}
	    	//change angle has nothing to do with character's action
	    });
	    
	    stick.on('start', function () {
	    	//when start touch the stick , player is running
	    	socket.emit('move');
	    	socket.emit('touchstart');
	    	
	    	socket.emit('run',true);
	    	socket.emit('idle',false);
	    	socket.emit('attack',false);
	    });
	    
	    stick.on('end', function (evt) {
	    	//when end touch ,player is idle
	    	socket.emit('stop');
	    	socket.emit('touchend');
	    	
	    	socket.emit('idle',true);
	    	socket.emit('run',false);
	    	socket.emit('attack',false);
	    });
	    
	    const attackBtn = document.getElementById('attack');
	    attackBtn.style.display = 'block';
	    attackBtn.onclick = function() {
	    	socket.emit('stop');
	    	
	    	socket.emit('run',false);
	    	socket.emit('idle',false);
	    	socket.emit('attack',true);
	    }
	    attackBtn.ontouchstart = function() {
	    	socket.emit('stop');
	    	
	    	socket.emit('run',false);
	    	socket.emit('idle',false);
	    	socket.emit('attack',true);
	    }
	    
	     
	    
	}
	
	initRabySkill(socket) {
		const vanish = document.getElementById('rabySkill');
		const mask = document.getElementById('mask');
		vanish.style.display = 'block';
		vanish.onclick = function() {
			socket.emit('vanish');
			mask.style.height = '40px';
			TweenMax.to(mask, 20,{ height : 0 });
			setTimeout(function() {
				socket.emit('real');
			},8000);
		};
		vanish.ontouchstart = function() {
			socket.emit('vanish');
			mask.style.height = '40px';
			TweenMax.to(mask, 20,{ height : 0});
			setTimeout(function() {
				socket.emit('real');
			},8000);
		};
		
	}

}

export default Stick;