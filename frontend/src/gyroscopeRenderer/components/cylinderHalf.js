import * as THREE from 'three';

class CylinderHalf {
  constructor(state, parameters, thetaStart, color){
  this.thetaStart = thetaStart
  this.oldPsi = state.psi
  this.parameters = parameters
  this.oldPosition = new THREE.Vector3()
  let geometry = new THREE.CylinderGeometry(
    parameters.a.value, // top radius
    parameters.a.value, // bottom radius
    parameters.h.value, // height
    32, // radial segments (default = 32)
    1, // height segments (default = 1)
    false, // true = open ended, false = filled
    thetaStart, // theta start
    Math.PI // theta length
    ); 
  // let material = new THREE.MeshBasicMaterial({color : color, wireframe : false})
  // let material = new THREE.MeshPhongMaterial({ color: color, shininess: 500 })
  let material = new THREE.MeshLambertMaterial({color : color})
  // let material = new THREE.MeshToonMaterial({color : color})
  this.cylinder = new THREE.Mesh(geometry, material);
  this.cylinder.castShadow = true


  // Adjust cylinder position, set oldPosition vector which we will need to perform rotations.
  this.cylinder.rotation.set(Math.PI/2,0,0) 
  this.cylinder.position.set(0,0,this.parameters.l.value)
  this.cylinder.getWorldPosition(this.oldPosition)
  this.tick(state)
  
  }
  get object() {
    return this.cylinder
  }

  changeParameters(parameters){
    let geometry = new THREE.CylinderGeometry(
      parameters.a.value, // top radius
      parameters.a.value, // bottom radius
      parameters.h.value, // height
      32, // radial segments (default = 32)
      1, // height segments (default = 1)
      false, // 0: open ended, 1: filled
      this.thetaStart, // theta start
      Math.PI // theta end
      ); 
    this.cylinder.geometry.dispose()
    this.cylinder.geometry = geometry
      // this.tick(state, false)
  }

  tick(state, rotate = true){
    if (rotate == false) {
      this.cylinder.position.set(state['x'], state['y'], state['z'])
      return
    }


    let currentPosition = new THREE.Vector3(state['x'], state['y'], state['z'])

    let angle = this.oldPosition.angleTo(currentPosition)
    let difference = currentPosition.clone().sub(this.oldPosition)
    let rotationVector = new THREE.Vector3().crossVectors(difference, this.oldPosition)

    // Move cylinder to new location
    this.cylinder.position.set(state['x'], state['y'], state['z'])

    // theta and phi rotations
    this.cylinder.rotateOnWorldAxis(rotationVector.normalize(), -angle)

    // psi rotation
    this.cylinder.rotateOnWorldAxis(currentPosition.normalize(), state['psi'] - this.oldPsi)

    // set oldPosition and old.Psi so the next rotation can be calculated properly
    this.oldPosition = currentPosition.clone()
    this.oldPsi = state['psi']
  }
}

export { CylinderHalf };