import * as THREE from 'three'

function createFloor(parameters){
    let geometry = new THREE.CircleGeometry(parameters.l.max * 2 * Math.tan(Math.PI/5), 500);
    let material = new THREE.MeshLambertMaterial( {color: 'gray', side: THREE.DoubleSide} );
    geometry.translate(0, 0, -parameters.l.max * 1.1)
    let floor = new THREE.Mesh( geometry, material );
    floor.receiveShadow = true
    return floor
}

export { createFloor }