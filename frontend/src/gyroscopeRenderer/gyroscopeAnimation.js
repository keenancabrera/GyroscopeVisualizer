import { createCamera } from './components/camera.js';
import { Cylinder } from './components/cylinder.js';
import { createScene } from './components/scene.js';
import { Rod } from './components/rod.js'
import { createLights } from './components/lights.js'
import { createFloor } from './components/floor.js'

import { createRenderer } from './systems/renderer.js';
import * as THREE from 'three';
import { Loop } from './systems/Loop.js'
import { createControls } from './systems/OrbitControls.js'
import { Resizer } from './systems/Resizer.js';

// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;
let loop;
let controls

class gyroscopeAnimation {
  constructor(container, parameters, state) {
    this.parameters = parameters // Affects parameters from parent component
    this.state = state // Affects initialState from parent component

    // Create necessary elements, set up renderer, add to container
    camera = createCamera(container, this.parameters);
    scene = createScene();
    renderer = createRenderer();
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      container.append(renderer.domElement);

    const resizer = new Resizer(container, camera, renderer);
    resizer.onResize = () => {
      this.render();
    }    
    controls = createControls(camera, renderer.domElement)
    controls.listenToKeyEvents(container)
    loop = new Loop(camera, scene, renderer, controls)


    // Add elements
    this.light = createLights(this.parameters)
    this.floor = createFloor(this.parameters)
    this.cylinderHalf = new Cylinder(this.state, parameters, 0, "blue")
    this.cylinderHalf2 = new Cylinder(this.state, parameters, Math.PI, "red")
    this.rod = new Rod(this.state, this.parameters)
    loop.updatables.push(this.cylinderHalf)
    loop.updatables.push(this.cylinderHalf2)
    loop.updatables.push(this.rod)

    this.axesHelper = new THREE.AxesHelper(3/2 * this.parameters.l.value)
    this.spotLightHelper = new THREE.SpotLightHelper(this.light)

    // Update cylinder position and orientation
    scene.add(this.cylinderHalf.object,this.cylinderHalf2.object, this.rod.object, this.light, this.floor);
    loop.start(this.state)
  }

  render() { // used to render a single frame
    renderer.render(scene, camera);
  }

  updateSolution(solution){
    loop.solution = solution
    loop.start(this.state)
  }

  updateParameters(parameters){
    this.parameters = parameters
    this.cylinderHalf.changeParameters(this.parameters)
    this.cylinderHalf2.changeParameters(this.parameters)
    this.render()
  }

  updateState(state){
    this.state = state
    this.cylinderHalf.tick(this.state)
    this.cylinderHalf2.tick(this.state)
    this.rod.tick(this.state)
    this.render()
  }
}

export { gyroscopeAnimation };