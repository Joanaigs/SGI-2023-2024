import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyVehicleObject } from '../vehicle/MyVehicleObject.js';
import { MySkybox } from '../../classes/MySkybox.js';

/**
 *  This class contains the park of the cars
 */
class MyPark extends THREE.Object3D {

    /**
     * Holds the park of the cars
     */
    constructor() {
        super();
        this.playerPark = new THREE.Group();
        this.playerCars = new THREE.Group();
        this.botCars = new THREE.Group();
        this.botPark = new THREE.Group();
    }

    /**
     * 
     * @returns the skybox of the scene of the park
     */
    initPark(){
        const skyboxData1 = {
            size: [1000, 249, 1000],
            center: [-2600, 249, -2500],
            emissive: 0xffffff,
            intensity: 2.0,
            up: './textures/up.jpg',
            down: './textures/dn_2.jpg',
            back: './textures/bk.jpg',
            left: './textures/lf.jpg',
            front: './textures/ft.jpg',
            right: './textures/rt.jpg',
        };

        const skybox1 = new MySkybox(skyboxData1);
        const skyboxMesh1 = skybox1.addSkybox();
        skyboxMesh1.receiveShadow = true;
        return skyboxMesh1;
    }
    
    /**
     * 
     * @returns the park of the player
     */
    buildPlayerPark(){

        const loader = new GLTFLoader();
        loader.load('./models/finalPlayerPark.gltf', (gltf) => {
            this.playerCandyShop = gltf.scene;
            this.playerCandyShop.scale.set(100, 100, 100);
            this.playerCandyShop.rotation.y = Math.PI;
            this.playerCandyShop.position.set(-2500, 126, -2500);

            for(let i = 0; i < this.playerCandyShop.children.length; i++){
                if(this.playerCandyShop.children[i].type == "Mesh"){
                    this.playerCandyShop.children[i].receiveShadow = true;
                }
                else{
                    for(let j = 0; j < this.playerCandyShop.children[i].children.length; j++){
                        this.playerCandyShop.children[i].children[j].castShadow = true;
                    }
                }
    
            }
            this.playerPark.add(this.playerCandyShop);
        });

        let donutGeometry = new THREE.TorusGeometry(15, 8, 64, 100); 
        let donutMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
        let donut = new THREE.Mesh(donutGeometry, donutMaterial);
        donut.position.set(-2509, 149, -2520.5);

        let donutGeometry2 = new THREE.TorusGeometry(15, 8, 64, 100); 
        let donutMaterial2 = new THREE.MeshPhongMaterial({ color: 0xEC5DBD });
        let donut2 = new THREE.Mesh(donutGeometry2, donutMaterial2);
        donut.castShadow = true;
        donut2.position.set(-2509, 149, -2522.5);


        this.groupDonut = new THREE.Group();
        this.groupDonut.add(donut, donut2);
        this.groupDonut.translateY(60);
        this.groupDonut.translateZ(19);
        this.groupDonut.translateX(7);

        
        this.car1 = new MyVehicleObject("pinkCar");
        this.car1.position.set(-2445, 126, -2570);
        this.car1.rotation.y = Math.PI;
        this.car1.scale.set(3,3,3);

        this.car2 = new MyVehicleObject("cyanCar");
        this.car2.position.set(-2415, 126, -2572);
        this.car2.rotation.y = Math.PI;
        this.car2.scale.set(3,3,3);

        this.car3 = new MyVehicleObject("cyanTruck");
        this.car3.position.set(-2583, 126, -2572);
        this.car3.rotation.y = Math.PI;
        this.car3.scale.set(3,3,3);

        this.car4 = new MyVehicleObject("pinkTruck");
        this.car4.position.set(-2555, 126, -2572);
        this.car4.rotation.y = Math.PI;
        this.car4.scale.set(3,3,3);

        this.playerPark.add(this.car1, this.car2, this.car3, this.car4, this.groupDonut);

        // Box a representar os veículos
        const boxGeometry1 = new THREE.BoxGeometry(20, 20, 50);
        const boxMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0  });
        const boxMesh1 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        boxMesh1.position.set(this.car1.position.x, this.car1.position.y+10, this.car1.position.z);
        this.playerCars.add(boxMesh1);
    
        // Adicionar caixa helper para car2
        const boxMesh2 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        boxMesh2.position.set(this.car2.position.x, this.car2.position.y+10, this.car2.position.z);
        this.playerCars.add(boxMesh2);
    
        // Adicionar caixa helper para car3
        const boxMesh3 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        boxMesh3.position.set(this.car3.position.x, this.car3.position.y+10, this.car3.position.z);
        this.playerCars.add(boxMesh3);
    
        // Adicionar caixa helper para car4
        const boxMesh4 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        boxMesh4.position.set(this.car4.position.x, this.car4.position.y+10, this.car4.position.z);
        this.playerCars.add(boxMesh4);

        return this.playerPark;
    }


    /**
     * 
     * @returns the park of the bot
     */
    buildBotPark() {
        const loader = new GLTFLoader();
        loader.load('./models/finalBotPark.gltf', (gltf) => {
            this.playerCandyShop = gltf.scene;
            this.playerCandyShop.scale.set(100, 100, 100);
            this.playerCandyShop.rotation.y = Math.PI;
            this.playerCandyShop.position.set(-2500, 126, -2500);

            for(let i = 0; i < this.playerCandyShop.children.length; i++){
                if(this.playerCandyShop.children[i].type == "Mesh"){
                    this.playerCandyShop.children[i].receiveShadow = true;
                }
                else{
                    for(let j = 0; j < this.playerCandyShop.children[i].children.length; j++){
                        this.playerCandyShop.children[i].children[j].castShadow = true;
                    }
                }
            }
    
            this.botPark.add(this.playerCandyShop);
        });
    
        this.carBot1 = new MyVehicleObject("orangeCar");
        this.carBot1.position.set(-2445, 126, -2570);
        this.carBot1.rotation.y = Math.PI;
        this.carBot1.scale.set(3, 3, 3);
    
        this.carBot2 = new MyVehicleObject("redCar");
        this.carBot2.position.set(-2415, 126, -2572);
        this.carBot2.rotation.y = Math.PI;
        this.carBot2.scale.set(3, 3, 3);
    
        this.carBot3 = new MyVehicleObject("redTruck");
        this.carBot3.position.set(-2583, 126, -2572);
        this.carBot3.rotation.y = Math.PI;
        this.carBot3.scale.set(3, 3, 3);
    
        this.carBot4 = new MyVehicleObject("orangeTruck");
        this.carBot4.position.set(-2555, 126, -2572);
        this.carBot4.rotation.y = Math.PI;
        this.carBot4.scale.set(3, 3, 3);

        this.botPark.add(this.carBot1, this.carBot2, this.carBot3, this.carBot4);

        // Box representing the vehicles
        const boxGeometry1 = new THREE.BoxGeometry(20, 20, 50);
        const boxMaterial1 = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0 });

        // Adding helper box for carBot1
        const boxMesh1 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        boxMesh1.position.set(this.carBot1.position.x, this.carBot1.position.y + 10, this.carBot1.position.z);
        this.botCars.add(boxMesh1);

        // Adding helper box for carBot2
        const boxMesh2 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        boxMesh2.position.set(this.carBot2.position.x, this.carBot2.position.y + 10, this.carBot2.position.z);
        this.botCars.add(boxMesh2);

        // Adding helper box for carBot3
        const boxMesh3 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        boxMesh3.position.set(this.carBot3.position.x, this.carBot3.position.y + 10, this.carBot3.position.z);
        this.botCars.add(boxMesh3);

        // Adding helper box for carBot4
        const boxMesh4 = new THREE.Mesh(boxGeometry1, boxMaterial1);
        boxMesh4.position.set(this.carBot4.position.x, this.carBot4.position.y + 10, this.carBot4.position.z);
        this.botCars.add(boxMesh4);

        return this.botPark;
    }
    
    getPlayerCars(){
        return this.playerCars;
    }
    
    getPlayerCar(index){
        return this.playerCars.children[index];
    }

    getBotCars(){
        return this.botCars;
    }

    getBotCar(index){
        return this.botCars.children[index];
    }

}

export { MyPark };