import * as THREE from 'three';
import { MyTrack } from './gameBackground/MyTrack.js';
import { MyPowerUps} from './gameBackground/MyPowerUps.js';
import { MyObstacle } from './gameBackground/MyObstacle.js';
import { MyVehicleObject } from './MyVehicleObject.js';
import { MyRoute } from './MyRoute.js';
import { MyCheckpoints } from './MyCheckpoints.js';
import { MySkybox } from '../classes/MySkybox.js';
import { MyPark } from './MyPark.js';
import { MyShader } from './MyShader.js';
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

    waitForShaders() {
        for(let i = 0; i < this.shaders.length; i++){
            if (this.shaders[i].ready === false) {
                setTimeout(this.waitForShaders.bind(this), 100)
                return;
            }
        }
        console.log("shaders loaded");
        this.initBackgroud();
        this.initPlayerPark();
    }

    waitForPowerUps() {
        if (this.powerUps.loadedObjects < this.powerUps.powerups.length) {
            setTimeout(this.waitForPowerUps.bind(this), 100)
            return;
        }
        console.log("powerups loaded");
        this.waitForObstacles();
    }

    waitForObstacles() {
        if (this.obstacles.loadedObjects < this.obstacles.obstacles.length) {
            setTimeout(this.waitForObstacles.bind(this), 100)
            return;
        }
        console.log("obstacles loaded");
        this.backgroundLoaded = true;
    }

    /**
     * initializes the contents
     */
    initBackgroud() {

        //ground
        const floorGeometry = new THREE.PlaneGeometry(this.app.skyboxObject.width, this.app.skyboxObject.depth, 100, 100);

        let floor = new THREE.Mesh(floorGeometry, this.shader.material);
        floor.rotation.x = Math.PI / 2;
        floor.rotation.y = Math.PI;
        floor.position.set(0, -1, 0);
        this.app.scene.add(floor);
        let track = this.myTrack.drawTrack(1, this.material);
        this.app.scene.add(track);
        let track2 = this.myTrack2.drawTrack(1, new THREE.MeshPhongMaterial({ color: 0xffffff, map: this.texture2}));
        this.app.scene.add(track2);
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
        this.car1 = new MyVehicleObject("cyan");
        this.car2 = new MyVehicleObject("purple");
        this.checkpoints.drawCheckpoints();

        //uncomment and remove last line
        this.waitForPowerUps();


    }

    reset(){
        this.obstacles.reset();
        this.app.scene.remove(this.car1);
        this.app.scene.remove(this.car2);
        this.car1=new MyVehicleObject("cyan");
        this.car2=new MyVehicleObject("purple");
        this.cutPath.visible = false;
    }

    initPlayerPark(){
        // Existing code for creating the first skybox
        const skyboxData1 = {
            size: [1000, 249, 1000],
            center: [-2500, 249, -2500],
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
        this.app.scene.add(skyboxMesh1);
        
        const playerPark = new MyPark();
        this.app.scene.add(playerPark.buildPlayerPark());
    }

    update(){
        if(this.shader.ready)
            this.shader.material.uniforms.time.value += 0.01;
    }
}

export { MyReader };