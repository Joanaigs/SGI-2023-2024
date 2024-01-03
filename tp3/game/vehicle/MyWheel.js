import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; // Import the GLTFLoader

/**
 * This class contains the wheel object
 */
 
class MyWheel extends THREE.Object3D {
    constructor() {
        super();
        this.rotationSpeed = 0; // Added rotationSpeed property
        this.clock = new THREE.Clock();
    }

    /**
     * Loads the model of the wheel
     * @param {*} callback 
     */
    loadModel(callback) {
        const loader = new GLTFLoader();
        loader.load('./models/wheel.gltf', (gltf) => {
            this.wheel = gltf.scene;
            if (callback) callback();
        });
    }

    /**
     * 
     * @returns the wheel object
     */
    build() {
        this.loadModel(() => {
            let groupTires = new THREE.Group();

            for (let i = 0; i < 4; i++) {
                const wheel = this.wheel.clone(); // Clone the loaded model
                if (i % 2 == 0) {
                    wheel.position.x = 3.0;
                    wheel.rotateY(Math.PI);
                } else {
                    wheel.position.x = -3.0;
                }
                if (i < 2) {
                    wheel.position.z = 4.2;
                } else {
                    wheel.position.z = -4.1;
                }
                wheel.position.y = 0.9;
                wheel.rotation.order = "YXZ";
                groupTires.add(wheel);
            }

            this.add(groupTires);

            // Save the wheels group reference for animation
            this.wheelsGroup = groupTires;
        });

        return this;
    }

    /**
     * Builds the truck wheels
     * @returns the wheel object
     */
    buildTruckWheels() {
        this.loadModel(() => {
            let groupTires = new THREE.Group();

            for (let i = 0; i < 4; i++) {
                const wheel = this.wheel.clone(); // Clone the loaded model
                if (i % 2 == 0) {
                    wheel.position.x = 2.9;
                    wheel.rotateY(Math.PI);
                } else {
                    wheel.position.x = -2.9;
                }
                if (i < 2) {
                    wheel.position.z = 4.2;
                } else {
                    wheel.position.z = -3.0;
                }
                wheel.position.y = 0.9;
                wheel.rotation.order = "YXZ";
                groupTires.add(wheel);
            }

            this.add(groupTires);

            // Save the wheels group reference for animation
            this.wheelsGroup = groupTires;
        });

        return this;
    }
}

export { MyWheel };
