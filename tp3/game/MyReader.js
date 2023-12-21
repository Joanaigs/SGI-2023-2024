import * as THREE from 'three';
import { MyTrack } from './gameBackground/MyTrack.js';
import { MyPowerUps} from './gameBackground/MyPowerUps.js';
import { MyObstacle } from './gameBackground/MyObstacle.js';
import { MyVehicleObject } from './MyVehicleObject.js';
import { MyRoute } from './MyRoute.js';
/**
 *  This class contains the contents of out application
 */
class MyReader {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(app) {
        this.app = app
        this.scaleTrack = 50;
        this.position = new THREE.Vector3(-100, 0, -100);
        this.myTrack = new MyTrack(this.app, this.scaleTrack, 40, this.position);
        this.powerUps = new MyPowerUps(this.app,this.position, this.scaleTrack);
        this.obstacles = new MyObstacle(this.app,this.position, this.scaleTrack);
        this.initBackgroud();
    }

    /**
     * initializes the contents
     */
    initBackgroud() {
        let track = this.myTrack.drawTrack(1);
        this.app.scene.add(track);
        this.cutPath = this.myTrack.drawTrack("Cut");
        this.app.scene.add(this.cutPath);
        this.cutPath.visible = false;
        this.powerUps.drawPowerUps(1);
        this.obstacles.drawObstacles(1);
        this.routes = new MyRoute(this.scaleTrack, this.position);
        this.car1 = new MyVehicleObject();
        this.car2 = new MyVehicleObject();

    }
}

export { MyReader };