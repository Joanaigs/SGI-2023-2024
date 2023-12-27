import * as THREE from 'three';
import { MyWheel } from './MyWheel.js';


/**
 *  This class contains the contents of out application
 */
class MyVehicleObject extends THREE.Object3D {

    constructor() {
        super();
        this.groupBody = new THREE.Group();
        this.groupWheels = new THREE.Group(); 
        this.build();
    }

    build() {
        let geometry = new THREE.BoxGeometry(5, 2, 10);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.y = 1;
        this.cube.position.z = 3;
        this.groupBody.add(this.cube);
        let wheelsObject = new MyWheel();
        this.groupWheels = wheelsObject.build(); 
        this.add(this.groupWheels);
        this.add(this.groupBody);
    }
}

export { MyVehicleObject };