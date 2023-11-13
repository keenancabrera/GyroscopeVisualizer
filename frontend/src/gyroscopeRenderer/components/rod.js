import * as THREE from 'three';

class Rod {
    constructor(state, parameters){
    this.parameters = parameters
    this.verticies = new Float32Array([0,0,0, state['x']* (parameters.l.max / parameters.l.value), state['y']* (parameters.l.max / parameters.l.value), state['z']* (parameters.l.max / parameters.l.value)])
    let material = new THREE.LineBasicMaterial( { color: 'white' , linewidth : 1} );
    let geometry = new THREE.BufferGeometry()
    this.rod = new THREE.Line( geometry, material );
    
    this.rod.geometry.setAttribute('position', new THREE.BufferAttribute(this.verticies, 3))
    }

    get object() {
        return this.rod
    }

    tick(state){
        this.verticies[3] = state['x'] * (this.parameters.l.max / this.parameters.l.value)
        this.verticies[4] = state['y'] * (this.parameters.l.max / this.parameters.l.value)
        this.verticies[5] = state['z'] * (this.parameters.l.max / this.parameters.l.value)
        this.rod.geometry.setAttribute('position', new THREE.BufferAttribute(this.verticies, 3))
    }
}

export { Rod };