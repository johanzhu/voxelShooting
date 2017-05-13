'use strict'
			import Player from './player';
			
			const b = 1;
			
			class Animal {
				constructor(name){
					this.name = name;
				}
				sayName() {
					console.log(this.name);
				}
				sayNum() {
					return 3
				}
			}
			
			const cat = new Animal('cat');
			cat.sayName();
			
			const player = new Player({x:1,y:2,z:3},1);
			