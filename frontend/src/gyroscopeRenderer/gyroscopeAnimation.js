import { createCamera } from './components/camera.js';
import { CylinderHalf } from './components/cylinderHalf.js';
import { createScene } from './components/scene.js';
import { Rod } from './components/rod.js'
import { createLights } from './components/lights.js'
import { createFloor } from './components/floor.js'

import { createRenderer } from './systems/renderer.js';
import { Loop } from './systems/Loop.js'
import { createControls } from './systems/OrbitControls.js'
import { Resizer } from './systems/Resizer.js';

// import * as THREE from 'three'; // For use with axes and light helpers

// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;
let loop;
let controls

class gyroscopeAnimation {
  constructor(container, parameters, state, solution) {
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
    loop = new Loop(camera, scene, renderer, controls, solution)


    // Add elements
    ;[this.spotLight, this.hemisphereLight] = createLights(this.parameters)
    this.floor = createFloor(this.parameters)
    this.blueHalf = new CylinderHalf(this.state, parameters, 0, "cornflowerblue")
    this.redHalf = new CylinderHalf(this.state, parameters, Math.PI, "crimson")
    this.rod = new Rod(this.state, this.parameters)
    loop.updatables.push(this.blueHalf)
    loop.updatables.push(this.redHalf)
    loop.updatables.push(this.rod)

    // this.axesHelper = new THREE.AxesHelper(3/2 * this.parameters.l.value)
    // this.spotLightHelper = new THREE.SpotLightHelper(this.light)

    // Update cylinder position and orientation
    scene.add(this.blueHalf.object,this.redHalf.object, this.rod.object, this.spotLight, this.hemisphereLight, this.floor);
    loop.start(this.state, true)
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
    loop.isPaused = true
    this.blueHalf.changeParameters(this.parameters)
    this.redHalf.changeParameters(this.parameters)
  }

  updateState(state){
    this.state = state
    loop.isPaused = true
    this.blueHalf.tick(this.state)
    this.redHalf.tick(this.state)
    this.rod.tick(this.state)
  }

  pause(state){
    this.state = state
    loop.isPaused = true
  }
}

export { gyroscopeAnimation };