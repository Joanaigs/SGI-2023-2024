import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MyShader } from '../MyShader.js';

/**
 * This class contains all Obstacles saved
 */
class MyObstacle {

    /**
     * Created all the obstacles and loads its shaders
     * @param {MyApp} app the application object
     * @param {vec3} position the position of the track
     * @param {number} scale the scale of the track
     */
    constructor(app, position, scale) {
        this.position = position;
        this.app = app;
        this.scale = scale;
        //obstacles, map of position and type 
        this.obstacle1 = [
            { key: new THREE.Vector3(5 * this.scale, 0, this.scale * 4.5), type: "CONFUSED" },
            { key: new THREE.Vector3(3 * this.scale, 0, this.scale * 14), type: "VELOCITY" },
            { key: new THREE.Vector3(1 * this.scale, 0, this.scale * 0), type: "SLIPPERY" },
        ]
        this.obstacleAvailable1 = [
            { key: new THREE.Vector3(4.1 * this.scale, 0, this.scale * 7.5), type: "CONFUSED" },
            { key: new THREE.Vector3(3.9 * this.scale, -2, this.scale * 7.5), type: "VELOCITY" },
            { key: new THREE.Vector3(4 * this.scale, -2, this.scale * 7.3), type: "SLIPPERY" },
        ]
        this.obstaclesObject = new Map();
        this.obstaclesAvailableObject = new Map();

        this.cabbageTexture = new THREE.TextureLoader().load('models/cabbage/cabbage.jpg');
        this.cabbageShader = new MyShader('shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.cabbageTexture },
            baseColor: { type: 'vec3', value: new THREE.Vector3(1.0, 1.0, 1.0) },
            scale: { type: 'f', value: 0.4 },
        })


        this.tomatoTexture = new THREE.TextureLoader().load('models/tomato/tomato.jpg');
        this.tomatoShader = new MyShader('shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.tomatoTexture },
            baseColor: { type: 'vec3', value: new THREE.Vector3(1.0, 1.0, 1.0) },
            scale: { type: 'f', value: 0.4 },

        })

        this.potatoTexture = new THREE.TextureLoader().load('models/potato/potato.png');
        this.potatoShader = new MyShader('shaders/pulsate.vert', 'shaders/pulsate_texture.frag', {
            time: { type: 'f', value: 0.0 },
            uSampler: { type: 'sampler2D', value: this.potatoTexture },
            baseColor: { type: 'vec3', value: new THREE.Vector3(1.0, 1.0, 1.0) },
            scale: { type: 'f', value: 0.4 },

        })


        this.materialList = []
        this.loadedObjects = 0;
        this.loadedObjectsAvailable = 0;


    }

    /**
     * Sets the game object
     * @param {MyGame} game  the game object
     */
    setGame(game) {
        this.game = game;
    }

    /**
     * Adds an obstacle to the map, changes the material to a shader
     * @param {THREE.Object3D} obstacle the obstacle to add 
     */
    addObstacle(obstacle) {
        this.obstaclesObject.set(obstacle, obstacle.name);
        switch (obstacle.name) {
            case "VELOCITY":
                let material = this.cabbageShader.material.clone();
                this.materialList.push(material);
                obstacle.material = material;
                break;
            case "CONFUSED":
                let material1 = this.potatoShader.material.clone();
                this.materialList.push(material1);
                obstacle.material = material1;
                break;
            case "SLIPPERY":
                let material2 = this.tomatoShader.material.clone();
                this.materialList.push(material2);
                obstacle.material = material2;
                break;
        }
    }

    /**
     * Adds to the scene all the obstacles belonging to the park
     * @param {number} value obstacles belonging to track n 
     */
    drawObstaclesPark(value) {
        if (value === 1) {
            for (let i = 0; i < this.obstacleAvailable1.length; i++) {
                this.drawObstaclePark(this.obstacleAvailable1[i], false);
            }
        }
    }

    /**
     * Adds to the scene all the obstacles belonging to the track
     * @param {Number} value obstacles belonging to track n
     */
    drawObstacles(value) {
        if (value === 1) {
            this.obstacles = this.obstacle1;
        }
        for (let i = 0; i < this.obstacles.length; i++) {
            this.drawObstacle(this.obstacles[i]);
        }
    }


    /**
     * Draws an obstacle in the scene
     * @param {THREE.Object3D} obstacle the obstacle to draw 
     * @param {boolean} visible if the obstacle is visible or not 
     */
    drawObstacle(obstacle, visible = true) {
        switch (obstacle.type) {
            case "VELOCITY":
                let cabbage = new OBJLoader();
                cabbage.load('models/cabbage/cabbage.obj', (loaded) => {
                    let object = loaded.children[0];
                    let material = this.cabbageShader.material;
                    object.material = material;
                    this.materialList.push(material);
                    object.scale.set(0.4, 0.4, 0.4);
                    object.rotation.x = -Math.PI / 2;
                    object.position.set(obstacle.key.x, obstacle.key.y + 2, obstacle.key.z);
                    object.position.add(this.position);
                    object.name = "VELOCITY";
                    object.visible = visible;
                    this.app.scene.add(object);
                    this.obstaclesObject.set(object, obstacle.type);
                    this.loadedObjects++;
                });
                break;
            case "CONFUSED":
                let potato = new OBJLoader();
                potato.load('models/potato/potato.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.x = -Math.PI / 2;
                    let material = this.potatoShader.material;
                    object.material = material;
                    this.materialList.push(material);
                    object.scale.set(3, 3, 3);
                    object.position.set(obstacle.key.x, obstacle.key.y + 2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible = visible;
                    object.name = "CONFUSED";
                    this.app.scene.add(object);
                    this.obstaclesObject.set(object, obstacle.type);
                    this.loadedObjects++;
                });
                break;
            case "SLIPPERY":
                let tomato = new OBJLoader();
                tomato.load('models/tomato/tomato.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.x = -Math.PI / 2;
                    let material = this.tomatoShader.material;
                    object.material = material;
                    this.materialList.push(material);
                    object.position.set(obstacle.key.x, obstacle.key.y + 2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible = visible;
                    object.name = "SLIPPERY";
                    this.app.scene.add(object);
                    this.obstaclesObject.set(object, obstacle.type);
                    this.loadedObjects++;
                });
                break;
        }
    }

    /**
     * Draws an obstacle in the park
     * @param {THREE.Object3D} obstacle the obstacle to draw 
     * @param {boolean} visible if the obstacle is visible or not 
     */
    drawObstaclePark(obstacle, visible = true) {
        switch (obstacle.type) {
            case "VELOCITY":
                let cabbage = new OBJLoader();
                cabbage.load('models/cabbage/cabbage.obj', (loaded) => {
                    let object = loaded.children[0];
                    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.cabbageTexture });
                    object.material = material;
                    object.scale.set(0.4, 0.4, 0.4);
                    object.position.set(obstacle.key.x, obstacle.key.y + 2, obstacle.key.z);
                    object.position.add(this.position);
                    object.rotation.x = -Math.PI / 2;
                    object.visible = visible;
                    object.name = "VELOCITY";
                    this.app.scene.add(object);
                    this.obstaclesAvailableObject.set(object, obstacle.type);
                    this.loadedObjectsAvailable++;
                });
                break;
            case "CONFUSED":
                let potato = new OBJLoader();
                potato.load('models/potato/potato.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.x = -Math.PI / 2;
                    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.potatoTexture });
                    object.material = material;
                    object.scale.set(3, 3, 3);
                    object.position.set(obstacle.key.x, obstacle.key.y + 2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible = visible;
                    object.name = "CONFUSED";
                    this.app.scene.add(object);
                    this.obstaclesAvailableObject.set(object, obstacle.type);
                    this.loadedObjectsAvailable++;
                });
                break;
            case "SLIPPERY":
                let tomato = new OBJLoader();
                tomato.load('models/tomato/tomato.obj', (loaded) => {
                    let object = loaded.children[0];
                    object.rotation.x = -Math.PI / 2;
                    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: this.tomatoTexture });
                    object.material = material;
                    object.position.set(obstacle.key.x, obstacle.key.y + 2, obstacle.key.z);
                    object.position.add(this.position);
                    object.visible = visible;
                    object.name = "SLIPPERY";
                    this.app.scene.add(object);
                    this.obstaclesAvailableObject.set(object, obstacle.type);
                    this.loadedObjectsAvailable++;
                });
                break;
        }
    }

    /**
     * Reduces the velocity of the car
     */
    obstacleVelocity() {
        this.scaleVelocity = this.game.car.velocity*0.5;

        // Increase velocity and maxVelocity
        this.game.car.velocity -= this.scaleVelocity;
        this.game.car.maxVelocity -= this.scaleVelocity;

        // Set a timeout to revert the changes after 10 seconds
        this.velocityTimeout = Date.now() + 10000;
    }

    /**
     * Confuses the car
     */
    obstacleConfused() {
        this.game.car.confused = true;
        this.confusedTimeout = Date.now() + 10000;
    }

    /**
     * Makes the car slippery
     */
    obstacleSlippery() {

        // Increase rotationScale
        this.game.car.carRotationScale += 1.5;

        // Set a timeout to revert the changes after 10 seconds
        this.slipperyTimeout = Date.now() + 10000;

        this.createRainParticleSystem();
        //darken ambient light
        this.game.app.scene.ambientLight.intensity -= 0.7;
        this.game.app.scene.ambientLight.color = new THREE.Color(0x222222);

    }

    /**
     * Creates a rain particle system
     */
    createRainParticleSystem() {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();

        const positions = [];
        const velocities = [];
        let minx = -100;
        let maxx = 100;

        let minz = -100;
        let maxz = 100;

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

    /**
     * fucntion call when a car hits an obstacle, to decide what to do
     * @param {MyGame} game myGame object 
     * @param {THREE.Object3D} object the object that the car hit 
     */
    activateObstacle(game, object) {
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

    /**
     * 
     * @returns a list of all the obstacles
     */
    getObstacles() {
        let keys = Array.from(this.obstaclesObject.keys());
        return keys;
    }

    /**
     * 
     * @returns a list of all the obstacles available
     */
    getObstaclesAvailable() {
        let keys = Array.from(this.obstaclesAvailableObject.keys());
        return keys;
    }

    /**
     * Resets the obstacles
     */
    reset() {
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstaclesObject.get(this.obstacles[i]);
            this.app.scene.remove(obstacle);
        }
        this.obstaclesObject.clear();
        this.obstaclesAvailableObject.clear();
    }

    /**
     * Updates the obstacles. Updates the time of the shaders, and deals with the timeout of the obstacles
     */
    update() {
        if (this.game) {
            if (!this.game.paused && this.game.started) {
                for (let i = 0; i < this.materialList.length; i++) {
                    this.materialList[i].uniforms.time.value += 0.05;
                }
            }
            if (this.game.paused) {
                if (!this.pausedClock)
                    this.pausedClock = Date.now();

            } else {
                if (this.pausedClock) {
                    if (this.velocityTimeout)
                        this.velocityTimeout += Date.now() - this.pausedClock;
                    if (this.confusedTimeout)
                        this.confusedTimeout += Date.now() - this.pausedClock;
                    if (this.slipperyTimeout)
                        this.slipperyTimeout += Date.now() - this.pausedClock;
                    this.pausedClock = null;
                }
                if (this.velocityTimeout && Date.now() > this.velocityTimeout) {
                    this.game.car.maxVelocity += this.scaleVelocity;
                    this.velocityTimeout = null;
                }
                if (this.confusedTimeout && Date.now() > this.confusedTimeout) {
                    this.game.car.confused = false;
                    this.confusedTimeout = null;
                }
                if (this.slipperyTimeout && Date.now() > this.slipperyTimeout) {
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
                            let maxz = 100;
                            positions[i] = Math.random() * (maxx - minx) + minx;
                            positions[i + 1] = 100;
                            positions[i + 2] = Math.random() * (maxz - minz) + minz;
                        }
                    }
                    this.particleSystem.position.copy(this.game.car.car.position);
                    this.particleSystem.geometry.attributes.position.needsUpdate = true;
                }
            }
        }
    }

    /**
     * 
     * @returns a list of all the shaders
     */
    getShaders() {
        return [this.cabbageShader, this.potatoShader, this.tomatoShader]
    }

}

export { MyObstacle };