import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * This class contains a Round Vase representation
 */
class MyFlower extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} size the size of each axis 
     * @param {hex} color the color of the vase
     * @param {list} position the position of the vase
     *
     */
    constructor(app, size, color, position, angle) {
        super();
        this.app = app;
        this.size = size || 2;
        this.color = color;
        this.meshes = [];
        this.samplesU = 20; // maximum defined in MyGuiInterface
        this.samplesV = 20; // maximum defined in MyGuiInterface
        this.builder = new MyNurbsBuilder();


        this.createFLower();
        this.position.set(position[0], position[1], position[2]);
        this.rotation.y = angle;

    }

    createFLower() {
        // Stem of the flower
        const material = new THREE.LineBasicMaterial({ color: 0x195905 });
        const stem = new THREE.QuadraticBezierCurve(
            new THREE.Vector3(0, 0, 0),        // Start point
            new THREE.Vector3(-0.5, 1, 0),        // Control point 1
            new THREE.Vector3(0, 1.5, 0)         // End point
        );
        const pointsStem = stem.getPoints(20);
        const geometryStem = new THREE.BufferGeometry().setFromPoints(pointsStem);

        const stemObject = new THREE.Line(geometryStem, material);
        this.add(stemObject);
        // Center of the flower
        const flowerCenterGeometry = new THREE.CircleGeometry(0.11, 32);
        const flowerCenterMaterial = new THREE.MeshBasicMaterial({ color: 0xeedc82, side: THREE.DoubleSide });
        const flowerCenterMesh = new THREE.Mesh(flowerCenterGeometry, flowerCenterMaterial);
        flowerCenterMesh.position.set(0.11, 1.5, 0);
        this.add(flowerCenterMesh);

        // Petals
        const numPetals = 8; // Adjust the number of petals as needed
        const petalAngleIncrement = (Math.PI * 2) / numPetals;

        for (let i = 0; i < numPetals; i++) {
            const petalGeometry = new THREE.ConeGeometry(0.05, 0.1, 32);
            const petalMaterial = new THREE.MeshBasicMaterial({ color: this.color });
            const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);

            // Position each petal around the flower center
            const angle = i * petalAngleIncrement;
            const radius = 0.15; // Adjust the radius as needed
            const x =0.11+ radius * Math.cos(angle);
            const z = 0;
            const y = 1.5 + radius * Math.sin(angle);; // Adjust the height of the petals as needed
            petalMesh.position.set(x, y, z);

            // Rotate petals to face outward
            petalMesh.rotation.z = angle - Math.PI / 2;


            this.add(petalMesh);
        }

    }

}

MyFlower.prototype.isGroup = true;
export { MyFlower };
