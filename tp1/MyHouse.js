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
        let size = 15;

        this.createWalls(size);
    }

    createWalls(size) {
        // Define the plane geometry at the class level
        this.planeGeometry = new THREE.PlaneGeometry(size * 2, size );
        const material = new THREE.MeshBasicMaterial({ color: 0xC9B7A4});

        const wall1 = new THREE.Mesh(this.planeGeometry, material);
        wall1.rotation.y = -Math.PI / 2;
        wall1.position.x = size;
        wall1.position.y = size/2;
        this.add(wall1);

        const wall2 = new THREE.Mesh(this.planeGeometry, material);
        wall2.rotation.y = Math.PI / 2;
        wall2.position.x = -size;
        wall2.position.y = size/2;
        this.add(wall2);

        const wall3 = new THREE.Mesh(this.planeGeometry, material);
        wall3.rotation.y = -Math.PI;
        wall3.position.z = size;
        wall3.position.y = size/2;
        this.add(wall3);

        const wall4 = new THREE.Mesh(this.planeGeometry, material);
        wall4.rotation.y = 0;
        wall4.position.z = -size;
        wall4.position.y = size/2;
        this.add(wall4);
    }


}

MyHouse.prototype.isGroup = true;
export { MyHouse };
