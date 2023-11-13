import { SpotLight } from 'three';

function createLights(parameters) {
    const spotLight = new SpotLight( 0xffffff , 1, 0, Math.PI/5, 0);
    spotLight.position.set( 0, 0, parameters.l.max * 2);
    spotLight.castShadow = true 

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.camera.near = 0.5
    spotLight.shadow.camera.far = 100

    return spotLight;
}

export { createLights }