import * as THREE from 'three';
import { MyWheel } from './MyWheel.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 *  This class contains the contents of our application
 */
class MyVehicleObject extends THREE.Object3D {
    constructor() {
        super();
        this.groupBody = new THREE.Group();
        this.groupWheels = new THREE.Group();
        this.build();
    }

    build() {
        const loader = new GLTFLoader();
        loader.load('./models/Car_Low_Poly.gltf', (gltf) => {
            this.car = gltf.scene;
            this.car.scale.set(1.5, 1.5, 1.5);
            this.car.rotation.y = Math.PI;
            this.car.position.set(0, 0, 0);
    
            // Adjusting material properties
            this.car.traverse((child) => {
                if (child.isMesh) {
                    console.log(child.material.type)
                    // Check if the mesh has a material, if it's not a multi-material, and if its current color is red
                    if (child.material.name == "red") {
                        console.log(child.material.color)
                        child.material.color.set(0xffffff);
                        child.material.emissive.set(0xFFBCF2 );
                        child.material.shininess = 10;
                        child.material.side = THREE.DoubleSide;
                    }
                }
            });
    
            this.groupBody.add(this.car);
        });

        let wheelsObject = new MyWheel();
        this.groupWheels = wheelsObject.build(); 
        this.add(this.groupWheels);
        this.add(this.groupBody);
    }
}

export { MyVehicleObject };
