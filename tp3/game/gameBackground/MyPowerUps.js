import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MyShader } from '../MyShader.js';


class MyPowerUps {


    constructor(app, position, scale) {
        this.position = position;
        this.app = app;
        this.scale = scale;
        //powerups, map of position and type 
        this.powerups1 = [
            { key: new THREE.Vector3(6.5 * this.scale, 0, this.scale * 13.5), type: "CUT" },
            { key: new THREE.Vector3(0.3 * this.scale, 0, this.scale * 15), type: "VELOCITY" },
            { key: new THREE.Vector3(8 * this.scale, 0, this.scale * 3), type: "VELOCITY" },
            { key: new THREE.Vector3(4.5 * this.scale, 0, this.scale * 5.5), type: "TIME" },
            { key: new THREE.Vector3(0 * this.scale, 0, this.scale * 1), type: "CHANGE" },

        ]
        this.powerUpsObject = new Map();
        this.texture= new THREE.TextureLoader().load('textures/wallPaper.jpg');

        this.heartTexture= new THREE.TextureLoader().load('textures/candy.jpg');
        this.heartShader = new MyShader(this.app, 'shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.heartTexture },
        })
        this.teddyShader = new MyShader(this.app, 'shaders/pulsate.vert', 'shaders/pulsate.frag', {
            time: { type: 'f', value: 0.0 },
            baseColor: { type: 'vec3', value: new THREE.Vector3(1.0, 0.5, 0.2) },
        })
        this.speedTexture= new THREE.TextureLoader().load('models/heart/speed.jpg');
        this.speedShader = new MyShader(this.app, 'shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.speedTexture },
        })
        this.mintTexture= new THREE.TextureLoader().load('models/mint/mint.png');
        this.mintShader = new MyShader(this.app, 'shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.mintTexture },
        })


        this.materialList = []
    }

    drawPowerUps(value) {
        if (value === 1) {
            this.powerups = this.powerups1;
        }
        for (let i = 0; i < this.powerups.length; i++) {
            this.drawPowerUp(this.powerups[i]);
        }
    }

    drawPowerUp(powerUps) {
        switch (powerUps.type) {
            case "VELOCITY":
                let candy = new OBJLoader();
                candy.load('models/heart/candy.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.y=Math.PI;
                    let material = this.heartShader.buildShader();
                    object.material = material;
                    this.materialList.push(material);
                    object.scale.set(4, 4, 4);
                    object.position.set(powerUps.key.x, powerUps.key.y+4, powerUps.key.z);
                    object.position.add(this.position);
                    this.app.scene.add(object);
                    this.powerUpsObject.set(object, powerUps.type);
                });
                break;
            case "CUT":
                let teddy = new OBJLoader();
                teddy.load('models/gummy-bear/gummy.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.y=-Math.PI/2;
                    let material = this.teddyShader.buildShader();
                    object.material = material;
                    this.materialList.push(material);
                    object.position.set(powerUps.key.x, powerUps.key.y+4, powerUps.key.z);
                    object.position.add(this.position);
                    this.app.scene.add(object);
                    this.powerUpsObject.set(object, powerUps.type);
                });
                break;            
            case "TIME":
                let speed = new OBJLoader();
                speed.load('models/heart/candy.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.y=Math.PI;
                    let material = this.speedShader.buildShader();
                    object.material = material;
                    this.materialList.push(material);
                    object.scale.set(4, 4, 4);
                    object.position.set(powerUps.key.x, powerUps.key.y+4, powerUps.key.z);
                    object.position.add(this.position);
                    this.app.scene.add(object);
                    this.powerUpsObject.set(object, powerUps.type);
                });
                break;
            case "CHANGE":
                let mint = new OBJLoader();
                mint.load('models/mint/mint.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.y=Math.PI;
                    let material = this.mintShader.buildShader();
                    object.material = material;
                    this.materialList.push(material);
                    object.position.set(powerUps.key.x, powerUps.key.y+4, powerUps.key.z);
                    object.position.add(this.position);
                    object.scale.set(0.05, 0.05, 0.05);
                    this.app.scene.add(object);
                    this.powerUpsObject.set(object, powerUps.type);
                });
            default:
                break;
        }
    }

    velocityPowerUp() {
        const originalMaxVelocity = this.game.car.maxVelocity;

        // Increase velocity and maxVelocity
        this.game.car.velocity += 0.5;
        this.game.car.maxVelocity += 0.5;

        // Set a timeout to revert the changes after 10 seconds
        setTimeout(() => {
            this.game.car.maxVelocity = originalMaxVelocity;
        }, 10000); // 10000 milliseconds = 10 seconds
    }

    velocityCutPowerUp() {
        this.game.cutPath.visible = true;
        setTimeout(() => {
            this.game.cutPath.visible = false;
        }, 5000);
    }

    timePowerUp() {
        this.game.penalties -= 1;
    }

    changePowerUp() {
        this.game.changePositionObstacles();
    }

    activatePowerUp(game, object) {
        this.game = game;
        let powerUp = this.powerUpsObject.get(object);
        console.log(powerUp);
        switch (powerUp) {
            case "VELOCITY":
                console.log("velocity");
                this.velocityPowerUp();
                break;
            case "CUT":
                this.velocityCutPowerUp();
                break;
            case "TIME":
                this.timePowerUp();
                break;
            case "CHANGE":
                this.changePowerUp();
                break;
            default:
                break;
        }
    }

    getPowerUps() {
        //list of keys
        let keys = Array.from(this.powerUpsObject.keys());
        console.log(keys);
        return keys;
    }

    update(){
        for(let i=0;i<this.materialList.length;i++){
            this.materialList[i].uniforms.time.value+=0.05;
        }
    }



}

export { MyPowerUps };