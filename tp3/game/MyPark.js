import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyVehicleObject } from './MyVehicleObject.js';

/**
 *  This class contains the contents of out application
 */
class MyPark extends THREE.Object3D {

    constructor() {
        super();
        this.playerPark = new THREE.Group();
        this.botPark = new THREE.Group();
    }
    
    buildPlayerPark(){
        const loader = new GLTFLoader();
        loader.load('./models/playerPark1.gltf', (gltf) => {
            this.playerCandyShop = gltf.scene;
            this.playerCandyShop.scale.set(100, 100, 100);
            this.playerCandyShop.rotation.y = Math.PI;
            this.playerCandyShop.position.set(-2500, 128, -2500);
    
            this.playerPark.add(this.playerCandyShop);
        });

        let donutGeometry = new THREE.TorusGeometry(15, 8, 64, 100); // Adjust parameters as needed
        let donutMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
        let donut = new THREE.Mesh(donutGeometry, donutMaterial);
        donut.position.set(-2509, 149, -2520.5);

        let donutGeometry2 = new THREE.TorusGeometry(15, 8, 64, 100); // Adjust parameters as needed
        let donutMaterial2 = new THREE.MeshBasicMaterial({ color: 0xEC5DBD });
        let donut2 = new THREE.Mesh(donutGeometry2, donutMaterial2);
        donut2.position.set(-2509, 149, -2522.5);


        this.groupDonut = new THREE.Group();
        this.groupDonut.add(donut, donut2);
        this.groupDonut.translateY(60);
        this.groupDonut.translateZ(19);
        this.groupDonut.translateX(7);

        this.car1 = new MyVehicleObject("pinkCar");
        this.car1.position.set(-2445, 128, -2570);
        this.car1.rotation.y = Math.PI;
        this.car1.scale.set(3,3,3);

        this.car2 = new MyVehicleObject("cyanCar");
        this.car2.position.set(-2415, 128, -2572);
        this.car2.rotation.y = Math.PI;
        this.car2.scale.set(3,3,3);

        this.car3 = new MyVehicleObject("cyanTruck");
        this.car3.position.set(-2583, 128, -2572);
        this.car3.rotation.y = Math.PI;
        this.car3.scale.set(3,3,3);

        this.car4 = new MyVehicleObject("pinkTruck");
        this.car4.position.set(-2555, 128, -2572);
        this.car4.rotation.y = Math.PI;
        this.car4.scale.set(3,3,3);

        this.playerPark.add(this.car1, this.car2, this.car3, this.car4, this.groupDonut);
        return this.playerPark;
    }


    buildBotPark(){
        const loader = new GLTFLoader();
        loader.load('./models/playerCandyShop/candyShop.gltf', (gltf) => {
            this.playerCandyShop = gltf.scene;
            this.playerCandyShop.scale.set(100, 100, 100);
            this.playerCandyShop.rotation.y = Math.PI;
            this.playerCandyShop.position.set(-2500, 128, -2500);
    
            this.botPark.add(this.playerCandyShop);
        });

        this.car1 = new MyVehicleObject("orangeCar");
        this.car1.position.set(-2445, 128, -2570);
        this.car1.rotation.y = Math.PI;
        this.car1.scale.set(3,3,3);

        this.car2 = new MyVehicleObject("redCar");
        this.car2.position.set(-2415, 128, -2572);
        this.car2.rotation.y = Math.PI;
        this.car2.scale.set(3,3,3);

        this.car3 = new MyVehicleObject("redTruck");
        this.car3.position.set(-2583, 128, -2572);
        this.car3.rotation.y = Math.PI;
        this.car3.scale.set(3,3,3);

        this.car4 = new MyVehicleObject("orangeTruck");
        this.car4.position.set(-2555, 128, -2572);
        this.car4.rotation.y = Math.PI;
        this.car4.scale.set(3,3,3);

        this.botPark.add(this.car1, this.car2, this.car3, this.car4);
        return this.botPark;
    }
    

}

export { MyPark };