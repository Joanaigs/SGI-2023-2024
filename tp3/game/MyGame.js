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
        this.obstacles = new MyObstacle(this,this.position);
        this.initBackgroud();

        

        const textureLoader = new THREE.TextureLoader();
        this.trackTexture = textureLoader.load('./textures/track.png');
        this.material = new THREE.MeshBasicMaterial({ map: this.trackTexture });
        this.geometry = new THREE.PlaneGeometry(100, 100, 100, 1);
        this.plano = new THREE.Mesh(this.geometry, this.material);
        this.plano.position.set(95, 0.08, 303);
        this.plano.rotation.x = -Math.PI / 2;
        this.plano.rotation.z = -Math.PI/60 ;
        this.plano.scale.set(5.05, 8.6, 10);
        //this.app.scene.add(this.plano);
    }

    /**
     * initializes the contents
     */
    initBackgroud() {
        let myTrack = new MyTrack(this.app, this.scaleTrack, 40, this.position);
        myTrack.drawTrack(1);
        this.powerUps.drawPowerUps(1);
        this.obstacles.drawObstacles(1);
        this.car = new MyVehicle(this, this.position, new THREE.Vector3(8*this.scaleTrack, 0, 5*this.scaleTrack) );
    }


    /**
     * Updates the scene
     */
    update() {

        this.car.update();
        
    }
}

export { MyGame };