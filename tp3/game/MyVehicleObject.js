import * as THREE from 'three';


/**
 *  This class contains the contents of out application
 */
class MyVehicleObject extends THREE.Object3D {


    constructor() {
        super();
        this.build();
    }

    build() {
        let groupBody = new THREE.Group();
        let geometry = new THREE.BoxGeometry( 5, 2, 10 );
        let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        this.cube = new THREE.Mesh( geometry, material );
        this.cube.position.y = 1;
        this.cube.position.z = 3;
        groupBody.add(this.cube);

        let groupTires = new THREE.Group();
        for (let i = 0; i < 4; i++) {
            let geometry = new THREE.CylinderGeometry( 1, 1, 0.5, 32 );
            let material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
            let cylinder = new THREE.Mesh( geometry, material );
            if (i % 2 == 0) {
                cylinder.position.x = 2.5;
            } else {
                cylinder.position.x = -2.5;
            }
            if (i < 2) {
                cylinder.position.z = 7;
            } else {
                cylinder.position.z = 0;
            }
            cylinder.position.y = 1;
            cylinder.rotateZ(Math.PI/2);
            groupTires.add(cylinder);
        }

        this.add(groupBody);
        this.add(groupTires);
    }

    
}

export { MyVehicleObject };