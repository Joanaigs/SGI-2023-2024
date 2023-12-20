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
    constructor(app) {
        this.app = app
        this.scaleTrack = 50;
        this.startTime = Date.now();
        this.penalties = 0;
        this.position = new THREE.Vector3(-100, 0, -100);
        this.powerUps = new MyPowerUps(this,this.position);
        this.obstacles = new MyObstacle(this,this.position);
        this.routes = new MyRoute(this.scaleTrack, this.position);
        this.initBackgroud();
    }

    /**
     * initializes the contents
     */
    initBackgroud() {
        let myTrack = new MyTrack(this.app, this.scaleTrack, 40, this.position);
        let track = myTrack.drawTrack(1);
        this.app.scene.add(track);
        this.cutPath = myTrack.drawTrack("Cut");
        this.app.scene.add(this.cutPath);
        this.cutPath.visible = false;
        this.powerUps.drawPowerUps(1);
        this.obstacles.drawObstacles(1);
        this.route = this.routes.getRoutes(1);
        this.car = new MyVehicle(this, this.position, new THREE.Vector3(8*this.scaleTrack, 0, 5*this.scaleTrack) );
        this.automaticVehicle = new MyAutomaticVehicle(this, this.position,new THREE.Vector3(8*this.scaleTrack, 0, 5*this.scaleTrack), this.route );
        this.automaticVehicle.start()
    }


    /**
     * Updates the scene
     */
    update() {
        this.car.update();
        this.automaticVehicle.update();

        
    }
}

export { MyGame };