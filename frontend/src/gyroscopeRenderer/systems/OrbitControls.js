import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas)
    controls.enablePan = false
    // controls.maxPolarAngle= Math.PI/2
    return controls
}

export { createControls };