import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MyShader } from '../MyShader.js';


class MyObstacle {


    constructor(app, position, scale) {
        this.position = position;
        this.app = app;
        this.scale=scale;
        //obstacles, map of position and type 
        this.obstacle1 = [
            {key: new THREE.Vector3(5*this.scale, 0, this.scale*4.5), type: "CONFUSED"},
            {key: new THREE.Vector3(3*this.scale, 0, this.scale*14), type: "VELOCITY"},
            {key: new THREE.Vector3(1*this.scale, 0, this.scale*0), type: "SLIPPERY"},
        ]
        this.obstacleAvailable1 = [
            {key: new THREE.Vector3(3*this.scale, 0, this.scale*8), type: "CONFUSED"},
            {key: new THREE.Vector3(3.5*this.scale, 0, this.scale*8), type: "VELOCITY"},
            {key: new THREE.Vector3(4*this.scale, 0, this.scale*8), type: "SLIPPERY"},
        ]
        this.obstaclesObject = new Map();
        this.obstaclesAvailableObject = new Map();

        this.garlicTexture= new THREE.TextureLoader().load('models/garlic/garlic.jpg');
        this.garlicShader = new MyShader( 'shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.garlicTexture },
        })

        
        this.tomatoTexture= new THREE.TextureLoader().load('models/tomato/tomato.jpg');
        this.tomatoShader = new MyShader( 'shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.tomatoTexture },
        })

        this.potatoTexture= new THREE.TextureLoader().load('models/potato/potato.jpg');
        this.potatoShader = new MyShader( 'shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.potatoTexture },
        })


        this.materialList = []
        this.loadedObjects = 0;
        this.loadedObjectsAvailable = 0;


    }

    addObstacle(obstacle){
        this.obstaclesObject.set(obstacle, obstacle.name);
        switch (obstacle.name) {
            case "VELOCITY":
                let material = this.garlicShader.material;
                this.materialList.push(material);
                obstacle.material = material;
                break;
            case "CONFUSED":
                let material1 = this.potatoShader.material;
                this.materialList.push(material1);
                obstacle.material = material1;
                break;
            case "SLIPPERY":
                let material2 = this.tomatoShader.material;
                this.materialList.push(material2);
                obstacle.material = material2;
                break;
        }
    }

    drawObstaclesPark(value) {
        if(value===1){
            for (let i = 0; i < this.obstacleAvailable1.length; i++) {
                this.drawObstaclePark(this.obstacleAvailable1[i], false);
            }
        }
    }

    drawObstacles(value) {
        if (value === 1) {
            this.obstacles=this.obstacle1;
        }
        for (let i = 0; i < this.obstacles.length; i++) {
            this.drawObstacle(this.obstacles[i]);
        }
    }


    drawObstacle(obstacle, visible=true){
        switch (obstacle.type) {
            case "VELOCITY":
                let garlic = new OBJLoader();
                garlic.load('models/garlic/garlic.obj', (loaded) => {
                    let object = loaded.children[0];
                    let material = this.garlicShader.material;
                    object.material = material;
                    this.materialList.push(material);
                    object.scale.set(0.2, 0.2, 0.2);
                    object.position.set(obstacle.key.x, obstacle.key.y+2, obstacle.key.z);
                    object.position.add(this.position);
                    object.name="VELOCITY";
                    object.visible=visible;
                    this.app.scene.add(object);
                    this.obstaclesObject.set(object, obstacle.type);
                    this.loadedObjects++;
                });
                break;
            case "CONFUSED":
                let potato = new OBJLoader();
                potato.load('models/potato/potato.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.x=-Math.PI/2;
                    let material = this.potatoShader.material;
                    object.material = material;
                    this.materialList.push(material);
                    object.scale.set(2, 2, 2);
                    object.position.set(obstacle.key.x, obstacle.key.y+2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible=visible;
                    object.name="CONFUSED";
                    this.app.scene.add(object);
                    this.obstaclesObject.set(object, obstacle.type);
                    this.loadedObjects++;
                });
                break;
            case "SLIPPERY":
                let tomato = new OBJLoader();
                tomato.load('models/tomato/tomato.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.x=-Math.PI/2;
                    let material = this.tomatoShader.material;
                    object.material = material;
                    this.materialList.push(material);
                    object.scale.set(2, 2, 2);
                    object.position.set(obstacle.key.x, obstacle.key.y+2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible=visible;
                    object.name="SLIPPERY";
                    this.app.scene.add(object);
                    this.obstaclesObject.set(object, obstacle.type);
                    this.loadedObjects++;
                });
                break;
        }
    }

    drawObstaclePark(obstacle, visible=true){
        switch (obstacle.type) {
            case "VELOCITY":
                let garlic = new OBJLoader();
                garlic.load('models/garlic/garlic.obj', (loaded) => {
                    let object = loaded.children[0];
                    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.garlicTexture});
                    object.material = material;
                    object.scale.set(0.2, 0.2, 0.2);
                    object.position.set(obstacle.key.x, obstacle.key.y+2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible=visible;
                    object.name="VELOCITY";
                    this.app.scene.add(object);
                    this.obstaclesAvailableObject.set(object, obstacle.type);
                    this.loadedObjectsAvailable++;
                });
                break;
            case "CONFUSED":
                let potato = new OBJLoader();
                potato.load('models/potato/potato.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.x=-Math.PI/2;
                    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.potatoTexture});
                    object.material = material;
                    object.scale.set(2, 2, 2);
                    object.position.set(obstacle.key.x, obstacle.key.y+2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible=visible;
                    object.name="CONFUSED";
                    this.app.scene.add(object);
                    this.obstaclesAvailableObject.set(object, obstacle.type);
                    this.loadedObjectsAvailable++;
                });
                break;
            case "SLIPPERY":
                let tomato = new OBJLoader();
                tomato.load('models/tomato/tomato.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.x=-Math.PI/2;
                    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.tomatoTexture});
                    object.material = material;
                    object.scale.set(2, 2, 2);
                    object.position.set(obstacle.key.x, obstacle.key.y+2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible=visible;
                    object.name="SLIPPERY";
                    this.app.scene.add(object);
                    this.obstaclesAvailableObject.set(object, obstacle.type);
                    this.loadedObjectsAvailable++;
                });
                break;
        }
    }

    obstacleVelocity(){
        const originalMaxVelocity = this.game.car.maxVelocity;
        const originalVelocity = this.game.car.velocity;
    
        // Increase velocity and maxVelocity
        this.game.car.velocity -= 0.5;
        this.game.car.maxVelocity -= 0.5;
        console.log(this.game.car.velocity);
    
        // Set a timeout to revert the changes after 10 seconds
        setTimeout(() => {
            this.game.car.maxVelocity = originalMaxVelocity;
            this.game.car.velocity = originalVelocity;
        }, 10000); // 10000 milliseconds = 10 seconds
    }

    obstacleConfused(){
        this.game.car.confused = true;
        setTimeout(() => {
            this.game.car.confused = false;
        }, 10000); // 10000 milliseconds = 10 seconds

    }

    obstacleSlippery(){

        // Increase rotationScale
        this.game.car.rotateScale += 0.5;

        setTimeout(() => {
            this.game.car.rotateScale -=0.5;
        }, 10000); // 10000 milliseconds = 10 seconds
    }

    activateObstacle(game, object){
        this.game = game;
        let obstacle = this.obstaclesObject.get(object);
        console.log(obstacle)
        switch (obstacle) {
            case "VELOCITY":
                this.obstacleVelocity();
                break;
            case "CONFUSED":
                this.obstacleConfused();
                break;
            case "SLIPPERY":
                this.obstacleSlippery();
                break;
        }
    }

    getObstacles(){
        let keys = Array.from(this.obstaclesObject.keys());
        console.log(this.obstaclesObject);
        return keys;
    }

    getObstaclesAvailable(){
        let keys = Array.from(this.obstaclesAvailableObject.keys());
        return keys;
    }

    reset(){
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstaclesObject.get(this.obstacles[i]);
            this.app.scene.remove(obstacle);
        }
        this.obstaclesObject.clear();
        this.obstaclesAvailableObject.clear();
    }

    update(){
        for(let i=0;i<this.materialList.length;i++){
            this.materialList[i].uniforms.time.value+=0.05;
        }
    }

    getShaders(){
        return [this.garlicShader, this.potatoShader, this.tomatoShader]
    }

}

export { MyObstacle };