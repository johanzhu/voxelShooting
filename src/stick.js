import nipplejs from 'nipplejs';
import Emitter from './emitter';

class Stick {
	construtor() {
		
	}
	
	init() {
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
	    	Emitter.emit('rotate',data);
	    });
	    stick.on('start', function (evt,data) {
	    	Emitter.emit('run',data);
	    });
	    stick.on('end', function (evt,data) {
	    	Emitter.emit('idle');
	    });
	    
	    const attackBtn = document.getElementById('attack');
	    attackBtn.style.display = 'block';
	    attackBtn.onclick = function() {
	    	Emitter.emit('attack');
	    }
	    
	}
}

export default Stick;