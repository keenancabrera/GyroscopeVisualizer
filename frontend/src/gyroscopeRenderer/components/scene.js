import { Scene } from 'three';

function createScene() {
  const scene = new Scene();

  // scene.background = new Color('black');
  scene.background = null
  return scene;
}

export { createScene };