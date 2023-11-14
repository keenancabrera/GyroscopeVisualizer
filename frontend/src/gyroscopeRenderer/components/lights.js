import { SpotLight, HemisphereLight} from 'three';

function createLights(parameters) {
    let spotLight = new SpotLight( 0xffffff , 1, 0, Math.PI/5, 0);
        spotLight.position.set( 0, 0, parameters.l.max * 2);
        spotLight.castShadow = true 
        spotLight.shadow.mapSize.width = 1024
        spotLight.shadow.mapSize.height = 1024
        spotLight.shadow.camera.near = 0.1
        spotLight.shadow.camera.far = 4 * parameters.l.max

    let hemisphereLight = new HemisphereLight('white', 'black', 0.2)
    
    return [spotLight, hemisphereLight];
}

export { createLights }