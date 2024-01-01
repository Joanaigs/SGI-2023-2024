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

        this.cabbageTexture= new THREE.TextureLoader().load('models/cabbage/cabbage.jpg');
        this.cabbageShader = new MyShader( 'shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.cabbageTexture },
        })

        
        this.tomatoTexture= new THREE.TextureLoader().load('models/tomato/tomato.jpg');
        this.tomatoShader = new MyShader( 'shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.tomatoTexture },
        })

        this.potatoTexture= new THREE.TextureLoader().load('models/potato/potato.png');
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
                let material = this.cabbageShader.material;
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
                let cabbage = new OBJLoader();
                cabbage.load('models/cabbage/cabbage.obj', (loaded) => {
                    let object = loaded.children[0];
                    let material = this.cabbageShader.material;
                    object.material = material;
                    this.materialList.push(material);
                    object.scale.set(0.2, 0.2, 0.2);
                    object.rotation.x=-Math.PI/2;
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
                let cabbage = new OBJLoader();
                cabbage.load('models/cabbage/cabbage.obj', (loaded) => {
                    let object = loaded.children[0];
                    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.cabbageTexture});
                    object.material = material;
                    object.scale.set(0.2, 0.2, 0.2);
                    object.position.set(obstacle.key.x, obstacle.key.y+2, obstacle.key.z);
                    object.position.add(this.position);
                    object.rotation.x=-Math.PI/2;
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
        this.originalMaxVelocity = this.game.car.maxVelocity;
        this.originalVelocity = this.game.car.velocity;
    
        // Increase velocity and maxVelocity
        this.game.car.velocity -= 0.5;
        this.game.car.maxVelocity -= 0.5;
    
        // Set a timeout to revert the changes after 10 seconds
        this.velocityTimeout = Date.now() + 10000;
    }

    obstacleConfused(){
        this.game.car.confused = true;
        this.confusedTimeout = Date.now() + 10000;
    }

    obstacleSlippery(){

        // Increase rotationScale
        this.game.car.carRotationScale += 1.5;

        // Set a timeout to revert the changes after 10 seconds
        this.slipperyTimeout = Date.now() + 10000;

        this.createRainParticleSystem();
        //darken ambient light
        this.game.app.scene.ambientLight.intensity -= 0.7;
        this.game.app.scene.ambientLight.color = new THREE.Color(0x222222);

    }

    createRainParticleSystem() {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
    
        const positions = [];
        const velocities = [];
        let minx = -100;
        let maxx = 100;

        let minz = -100;
        let maxz =  100;
    
        for (let i = 0; i < particleCount; i++) {
            // Randomly position particles above the scene
            positions.push(Math.random() * (maxx - minx) + minx, 100, Math.random() * (maxz - minz) + minz);
            
            // Assign random velocities to simulate rain movement
            velocities.push(0, -Math.random() * 3, 0);
        }
    
        particles.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        particles.setAttribute('velocity', new THREE.BufferAttribute(new Float32Array(velocities), 3));
    
        const material = new THREE.PointsMaterial({ color: 0x0077ff, size: 2 });
    
        this.particleSystem = new THREE.Points(particles, material);
        this.particleSystem.position.copy(this.game.car.car.position);
        this.app.scene.add(this.particleSystem);
    }

    activateObstacle(game, object){
        this.game = game;
        let obstacle = this.obstaclesObject.get(object);
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

        if(this.velocityTimeout && Date.now() > this.velocityTimeout){
            this.game.car.maxVelocity = this.originalMaxVelocity;
            this.game.car.velocity = this.originalVelocity;
            this.velocityTimeout = null;
        }
        if(this.confusedTimeout && Date.now() > this.confusedTimeout){
            this.game.car.confused = false;
            this.confusedTimeout = null;
        }
        if(this.slipperyTimeout && Date.now() > this.slipperyTimeout){
            this.game.car.carRotationScale -= 1.5;
            this.slipperyTimeout = null;
            this.app.scene.remove(this.particleSystem);
            this.particleSystem = null;
            this.game.app.scene.ambientLight.intensity += 0.7;
            this.game.app.scene.ambientLight.color = new THREE.Color(0xffffff);
        }

        if (this.particleSystem) {

            const positions = this.particleSystem.geometry.attributes.position.array;
            const velocities = this.particleSystem.geometry.attributes.velocity.array;
    
            for (let i = 0; i < positions.length; i += 3) {

                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
    
                // Reset position if particles fall below a certain threshold
                if (positions[i + 1] < -20) {
                    let minx = -100;
                    let maxx = 100;
            
                    let minz = -100;
                    let maxz =  100;
                    positions[i] = Math.random() * (maxx - minx) + minx;
                    positions[i + 1] = 100;
                    positions[i + 2] = Math.random() * (maxz - minz) + minz;
                }
            }
            this.particleSystem.position.copy(this.game.car.car.position);
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }

    getShaders(){
        return [this.cabbageShader, this.potatoShader, this.tomatoShader]
    }

}

export { MyObstacle };