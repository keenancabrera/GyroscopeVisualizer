import { PerspectiveCamera } from 'three';

function createCamera(container, parameters) {
  const camera = new PerspectiveCamera(
    75,// fov = Field of View 
    container.clientWidth /container.clientHeight, // aspect ratio
    0.1, //near clipping plane
    1000, // far clipping plane
  );


  camera.up.set(0,0,1) // Set up to be z axis
  camera.position.set(parameters.l.max * 1.5, parameters.l.max * 1.5, parameters.l.max * 1.5); // move camera away from origin
  camera.lookAt(0,0,0) // focus camera at origin

  return camera;
}

export { createCamera };