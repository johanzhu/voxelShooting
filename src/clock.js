import * as THREE from 'three';

class Clock extends THREE.Clock {

  constructor() {
    super( true ); 
  }

  get delta() {
    return this.getDelta();
  }

  get time() {
    return this.getElapsedTime();
  }
}

export default Clock;