import * as THREE from 'three';
import { MyTrack } from './track/MyTrack.js';
import { MyPowerUps} from './track/MyPowerUps.js';
import { MyObstacle } from './track/MyObstacle.js';
import { MyVehicleObject } from './vehicle/MyVehicleObject.js';
import { MyRoute } from './track/MyRoute.js';
import { MyCheckpoints } from './track/MyCheckpoints.js';
import { MyShader } from './MyShader.js';
/**
 *  This class contains reads the game background
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

        this.textureCut = this.textureLoader.load("textures/track.jpg");
        this.textureCut.wrapS = THREE.RepeatWrapping;
        this.textureCut.wrapT = THREE.RepeatWrapping;
        this.textureCut.repeat.set(1, 3.5);

        this.textureCut2 = this.textureLoader.load("textures/track1.jpg");
        this.textureCut2.wrapS = THREE.RepeatWrapping;
        this.textureCut2.wrapT = THREE.RepeatWrapping;
        this.textureCut2.repeat.set(1, 3.5);
        this.backgroundLoaded = false;

        // Material for the track
        this.material = new THREE.MeshPhongMaterial({ color: 0xffffff, map: this.texture });
        
        
        this.myTrack = new MyTrack(this.app, this.scaleTrack, 40, this.position);
        this.myTrack2 = new MyTrack(this.app, this.scaleTrack, 60, new THREE.Vector3(-100, -0.5, -100));

        this.powerUps = new MyPowerUps(this.app,this.position, this.scaleTrack);
        this.obstacles = new MyObstacle(this.app,this.position, this.scaleTrack);
        this.checkpoints = new MyCheckpoints(this.app, this.scaleTrack, this.position, 40);

        //shaders
        this.shaders = []
        let textureFloor = new THREE.TextureLoader().load('textures/dn.jpg');
        let textureFloorHeight = new THREE.TextureLoader().load('textures/dn_height_map.png');

        this.shader = new MyShader( 'shaders/terrain.vert', 'shaders/terrain.frag', {
            terrain:{ type: 'sampler2D', value: textureFloor},
            heightMap: { type: 'sampler2D', value: textureFloorHeight },
            time: { type: 'f', value: 0.0 }
        })
        this.shaders.push(this.shader);
              
        this.shaders.concat(this.powerUps.getShaders());
        this.shaders.concat(this.obstacles.getShaders());
        
        this.waitForShaders();
    }

    /**
     * Waits for the shaders to load
     */
    waitForShaders() {
        for(let i = 0; i < this.shaders.length; i++){
            if (this.shaders[i].ready === false) {
                setTimeout(this.waitForShaders.bind(this), 100)
                return;
            }
        }
        this.initBackgroud();
    }

    /**
     * waits for the powerups to load
     */
    waitForPowerUps() {
        if (this.powerUps.loadedObjects < this.powerUps.powerups.length) {
            setTimeout(this.waitForPowerUps.bind(this), 100)
            return;
        }
        this.waitForObstacles();
    }

    /**
     * waits for the obstacles to load
     */
    waitForObstacles() {
        if (this.obstacles.loadedObjects < this.obstacles.obstacles.length) {
            setTimeout(this.waitForObstacles.bind(this), 100)
            return;
        }
        this.backgroundLoaded = true;
    }

    /**
     * initializes the contents of the track
     */
    initBackgroud() {

        //ground
        const floorGeometry = new THREE.PlaneGeometry(this.app.skyboxObject.width, this.app.skyboxObject.depth, 100, 100);

        let floor = new THREE.Mesh(floorGeometry, this.shader.material);
        floor.receiveShadow = true;
        floor.rotation.x = Math.PI / 2;
        floor.rotation.y = Math.PI;
        floor.position.set(0, -1, 0);
        this.app.scene.add(floor);
        let track = this.myTrack.drawTrack(1, this.material);
        this.app.scene.add(track);
        this.track2 = this.myTrack2.drawTrack(1, new THREE.MeshPhongMaterial({ color: 0xffffff, map: this.texture2}));
        this.app.scene.add(this.track2);
        this.cutPath = this.myTrack.drawTrack("Cut", new THREE.MeshPhongMaterial({ color: 0xffffff, map: this.textureCut }));
        this.app.scene.add(this.cutPath);
        this.cutPath2 = this.myTrack2.drawTrack("Cut", new THREE.MeshPhongMaterial({ color: 0xffffff, map: this.textureCut2}));
        this.cutPath2.position.set(0, -0.5, 0);
        this.cutPath.add(this.cutPath2);
        this.cutPath.visible = false;
        this.powerUps.drawPowerUps(1);
        this.obstacles.drawObstacles(1);
        this.obstacles.drawObstaclesPark(1);
        this.routes = new MyRoute(this.scaleTrack, this.position);
        this.checkpoints.drawCheckpoints();

        //uncomment and remove last line
        this.waitForPowerUps();


    }

    reset(){
        this.obstacles.reset();
        this.cutPath.visible = false;
    }

    update(){
        if(this.shader.ready)
            this.shader.material.uniforms.time.value += 0.01;
    }
}

export { MyReader };