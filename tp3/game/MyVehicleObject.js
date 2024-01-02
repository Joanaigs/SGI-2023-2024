import * as THREE from 'three';
import { MyWheel } from './MyWheel.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 *  This class contains the contents of our application
 */
class MyVehicleObject extends THREE.Object3D {
    constructor(carType) {
        super();
        this.groupBody = new THREE.Group();
        this.groupWheels = new THREE.Group();
        

        if(carType == "pinkTruck") this.buildTruck(0xFFBCF2);
        else if (carType == "cyanTruck") this.buildTruck(0x7BD2E4);
        else if (carType == "orangeTruck") this.buildTruck(0xFF964F);
        else if(carType == "redTruck") this.buildTruck(0xFF6961);
        if (carType == "pinkCar") this.buildCar(0xFFBCF2);
        else if (carType == "cyanCar") this.buildCar(0x7BD2E4);
        else if (carType == "orangeCar") this.buildCar(0xFF964F);
        else if (carType == "redCar") this.buildCar(0xFF6961);
        // EC5DBD donut

    }


    buildTruck(hexColor) {
        const loader = new GLTFLoader();
        loader.load('./models/car.gltf', (gltf) => {
            this.car = gltf.scene;
            this.car.scale.set(1.5, 1.2, 1.2);
            this.car.position.set(0, 0, 0);
    
            // Adjusting material properties
            this.car.traverse((child) => {
                if (child.isMesh) {
                    if (child.material.name == "Car body") {
                        child.material.color.set(hexColor);
                        child.material.emissive.set(0);
                        child.material.shininess = 0;
                        child.material.side = THREE.DoubleSide;
                    }
                }
            });

            this.groupBody.add(this.car);
        });

        let wheelsObject = new MyWheel();
        this.groupWheels = wheelsObject.buildTruckWheels(); 
        this.add(this.groupWheels);
        this.add(this.groupBody);
    }

    buildCar(hexColor) {
        const loader = new GLTFLoader();
        loader.load('./models/Car_Low_Poly.gltf', (gltf) => {
            this.car = gltf.scene;
            this.car.scale.set(1.5, 1.5, 1.5);
            this.car.rotation.y = Math.PI;
            this.car.position.set(0, 0.5, 0);
    
            // Adjusting material properties
            this.car.traverse((child) => {
                if (child.isMesh) {
                    // Check if the mesh has a material, if it's not a multi-material, and if its current color is red
                    if (child.material.name == "red") {
                        child.material.color.set(hexColor);
                        child.material.emissive.set(0);
                        child.material.shininess = 0;
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
