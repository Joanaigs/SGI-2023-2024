import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Floor representation
 */
class MyHouse extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';

        // Create a Plane Mesh with basic material
        //floor
        let plane = new THREE.PlaneGeometry( 10, 10 );
        const floor = new THREE.Mesh( plane, app.planeMaterial );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0;
        this.add(floor);


        //walls
        const wall1 = new THREE.Mesh( plane, app.planeMaterial );
        wall1.rotation.y = -Math.PI / 2;
        wall1.position.x = 5;
        wall1.position.y = 5;
        this.add(wall1);

        const wall2 = new THREE.Mesh( plane, app.planeMaterial );
        wall2.rotation.y = Math.PI / 2;
        wall2.position.x = -5;
        wall2.position.y = 5;
        this.add(wall2);

        const wall3 = new THREE.Mesh( plane, app.planeMaterial );
        wall3.rotation.y = -Math.PI;
        wall3.position.z = 5;
        wall3.position.y = 5;
        this.add(wall3);

        const wall4 = new THREE.Mesh( plane, app.planeMaterial );
        wall4.rotation.y = 0;
        wall4.position.z = -5;
        wall4.position.y = 5;
        this.add(wall4);

        
    }
}

MyHouse.prototype.isGroup = true;
export { MyHouse };