import * as THREE from 'three';
import { MyTrack } from './gameBackground/MyTrack.js';
import { MyPowerUps} from './gameBackground/MyPowerUps.js';
import { MyObstacle } from './gameBackground/MyObstacle.js';
import { MyVehicle } from './MyVehicle.js';
/**
 *  This class contains the contents of out application
 */
class MyGame {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.scaleTrack = 50;
        this.position = new THREE.Vector3(-100, 0, -100);
        this.powerUps = new MyPowerUps(this,this.position);
        this.obstacle = new MyObstacle(this,this.position);
        this.initBackgroud();
    }

    /**
     * initializes the contents
     */
    initBackgroud() {
        let myTrack = new MyTrack(this.app, this.scaleTrack, 40, this.position);
        myTrack.drawTrack(1);
        this.powerUps.drawPowerUps(1);
        this.obstacle.drawObstacles(1);
        this.car = new MyVehicle(this.app, this.position, new THREE.Vector3(8*this.scaleTrack, 0, 5*this.scaleTrack) );
    }


    /**
     * Updates the scene
     */
    update() {

        this.car.update();
        
    }
}

export { MyGame };