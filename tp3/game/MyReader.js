import * as THREE from 'three';
import { MyTrack } from './gameBackground/MyTrack.js';
import { MyPowerUps} from './gameBackground/MyPowerUps.js';
import { MyObstacle } from './gameBackground/MyObstacle.js';
import { MyVehicleObject } from './MyVehicleObject.js';
import { MyRoute } from './MyRoute.js';
import { MyCheckpoints } from './MyCheckpoints.js';
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
        // texture
        this.textureLoader = new THREE.TextureLoader();
        this.texture = this.textureLoader.load("textures/track.jpg");
        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;
        this.texture.repeat.set(1, 50);

        this.texture2 = this.textureLoader.load("textures/track1.jpg");
        this.texture2.wrapS = THREE.RepeatWrapping;
        this.texture2.wrapT = THREE.RepeatWrapping;
        this.texture2.repeat.set(1, 50);



        // Material for the track
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.texture });
        
        
        this.myTrack = new MyTrack(this.app, this.scaleTrack, 40, this.position, this.material);
        this.myTrack2 = new MyTrack(this.app, this.scaleTrack, 60, new THREE.Vector3(-100, -0.5, -100), new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.texture2}));

        this.powerUps = new MyPowerUps(this.app,this.position, this.scaleTrack);
        this.obstacles = new MyObstacle(this.app,this.position, this.scaleTrack);
        this.checkpoints = new MyCheckpoints(this.app, this.scaleTrack, this.position, 40);
        this.initBackgroud();
    }

    /**
     * initializes the contents
     */
    initBackgroud() {
        let track = this.myTrack.drawTrack(1);
        this.app.scene.add(track);
        let track2 = this.myTrack2.drawTrack(1);
        this.app.scene.add(track2);
        this.cutPath = this.myTrack.drawTrack("Cut");
        this.app.scene.add(this.cutPath);
        this.cutPath.visible = false;
        this.powerUps.drawPowerUps(1);
        this.obstacles.drawObstacles(1);
        this.obstacles.drawObstaclesPark(1);
        this.routes = new MyRoute(this.scaleTrack, this.position);
        this.car1 = new MyVehicleObject();
        this.car2 = new MyVehicleObject();
        this.checkpoints.drawCheckpoints();
    }

    reset(){
        this.obstacles.reset();
        this.app.scene.remove(this.car1);
        this.app.scene.remove(this.car2);
        this.car1=new MyVehicleObject();
        this.car2=new MyVehicleObject();
        this.cutPath.visible = false;

    }
}

export { MyReader };