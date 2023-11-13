import * as THREE from 'three'

function createFloor(parameters){
    let geometry = new THREE.PlaneGeometry( 5000, 5000 );
    let material = new THREE.MeshLambertMaterial( {color: 'gray', side: THREE.DoubleSide} );
    geometry.translate(0, 0, -parameters.l.max * 1.1)
    let floor = new THREE.Mesh( geometry, material );
    floor.receiveShadow = true
    return floor
}

export { createFloor }