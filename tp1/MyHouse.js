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
        let size = 20;

        // Define the plane geometry at the class level
        this.planeGeometry = new THREE.PlaneGeometry(size * 2, size * 2);
        this.createFloor(size);
        this.createWalls(size);
    }

    createWalls(size) {
        const material = new THREE.MeshBasicMaterial({ color: 0xF5F5DD });

        const wall1 = new THREE.Mesh(this.planeGeometry, material);
        wall1.rotation.y = -Math.PI / 2;
        wall1.position.x = size;
        wall1.position.y = size;
        this.add(wall1);

        const wall2 = new THREE.Mesh(this.planeGeometry, material);
        wall2.rotation.y = Math.PI / 2;
        wall2.position.x = -size;
        wall2.position.y = size;
        this.add(wall2);

        const wall3 = new THREE.Mesh(this.planeGeometry, material);
        wall3.rotation.y = -Math.PI;
        wall3.position.z = size;
        wall3.position.y = size;
        this.add(wall3);

        const wall4 = new THREE.Mesh(this.planeGeometry, material);
        wall4.rotation.y = 0;
        wall4.position.z = -size;
        wall4.position.y = size;
        this.add(wall4);
    }

    createFloor(size) {
    const material = new THREE.MeshBasicMaterial({ color: 0xD2BD96 /*C8AE7E*/ });
        const floor = new THREE.Mesh(this.planeGeometry, material);

        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0;

        this.add(floor);
    }
}

MyHouse.prototype.isGroup = true;
export { MyHouse };
