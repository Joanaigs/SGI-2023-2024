import * as THREE from 'three';
import { MyTrack } from './gameBackground/MyTrack.js';
import { MyPowerUps} from './gameBackground/MyPowerUps.js';
import { MyObstacle } from './gameBackground/MyObstacle.js';
import { MyVehicle } from './MyVehicle.js';
import { MyRoute } from './MyRoute.js';
import { MyAutomaticVehicle } from './MyAutomaticVehicle.js';
/**
 *  This class contains the contents of out application
 */
class MyGame {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app, car, enemyCar, powerUps, obstacles, routes, cutPath) {
        this.app = app
        this.scaleTrack = 50;
        this.startTime = Date.now();
        this.penalties = 0;
        this.position = new THREE.Vector3(-100, 0, -100);
        this.powerUps = powerUps;
        this.obstacles = obstacles;
        this.routes = routes;
        this.cutPath = cutPath;
        this.car = new MyVehicle(this, this.position, new THREE.Vector3(8*this.scaleTrack, 0, 5*this.scaleTrack), car );
        this.automaticVehicle = new MyAutomaticVehicle(this, this.position,new THREE.Vector3(8*this.scaleTrack, 0, 5*this.scaleTrack), this.routes.getRoutes(1), enemyCar );
        this.gameOver=false;
        this.started=false;

    }

    /**
     * initializes the contents
     */
    start() {
        this.automaticVehicle.start()

    }


    /**
     * Updates the scene
     */
    update() {
        this.car.update();
        this.automaticVehicle.update();

        if(this.app.activeCameraName == "car")
            this.updateCamera();
    }

    updateCamera() {
        // Set the camera position to follow the car
        const offset = new THREE.Vector3(0, 10, -20); 
        const carPosition = this.car.car.position.clone();
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(this.car.rotation); 
    
        // Apply the rotation to the offset vector
        offset.applyMatrix4(rotationMatrix);
        this.app.activeCamera.position.copy(carPosition.add(offset));

        // Set the camera to look at the car
        this.app.activeCamera.lookAt(this.car.car.position);
        this.app.controls.target = this.car.car.position;
    }
}

export { MyGame };