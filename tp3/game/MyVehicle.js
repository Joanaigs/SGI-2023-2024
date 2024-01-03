import * as THREE from 'three';


/**
 *  This class contains the vehicles of the game
 */
class MyVehicle {

    /**
     * This constructor creates the vehicle
     * @param {} game the game object 
     * @param {*} position the position of the car
     * @param {*} target the target of the car 
     * @param {*} car  the car object
     */
    constructor(game, position, target, car) {

        this.game = game
        this.helperObj = new Map();
        this.timeInPause = 0;
        this.rotation = 0;
        this.laps = 0;
        this.wheelRotation = 0;
        this.maxRotation = 0.6;
        this.carsCollided = false;
        this.minRotation = -0.6;
        this.carRotationScale = 1.0;
        this.rotateScale = 0.1;
        this.velocity = 0;
        this.acceleration = 0.05;
        this.maxVelocity = 1.0;
        this.minVelocity = -0.5;
        this.confused = false;
        this.track = this.game.track;
        this.velocityReduced = false;


        this.powerUps = this.game.powerUps.getPowerUps();
        this.obstacles = this.game.obstacles.getObstacles();
        this.checkPoints = this.game.checkpoints.getCheckpoints();
        this.checkpointsCount = new Map();
        this.checkPointCollided = false;
        this.lastCheckpoint = null;
        for (let i = 0; i < this.checkPoints.length; i++) {
            this.checkpointsCount.set(this.checkPoints[i], 0);
        }
        //map objeto and coliision
        this.poweupsActivated = new Map();
        this.obstaclesActivated = new Map();
        for (let i = 0; i < this.powerUps.length; i++) {
            this.poweupsActivated.set(this.powerUps[i], false);
        }
        for (let i = 0; i < this.obstacles.length; i++) {
            this.obstaclesActivated.set(this.obstacles[i], false);
        }
        this.car = car;
        this.car.position.set(position.x, position.y, position.z);
        this.car.position.add(target);
        this.game.gameGroup.add(this.car);


        this.trackTexture = new THREE.TextureLoader().load('./textures/track.png');

        this.renderTarget = new THREE.WebGLRenderTarget(411, 700);

        this.normalVelTex = new THREE.TextureLoader().load('./textures/velocity_normal.png');

    }

    /**
     * Add Obstacel to the game
     * @param {*} obstacle 
     */
    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
        this.obstaclesActivated.set(obstacle, false);
    }

    /**
     * Updates the number of laps the car has done
     */
    updateNumberOfLaps() {
        let min = 5;
        for (let i = 0; i < this.checkPoints.length; i++) {
            if (this.checkpointsCount.get(this.checkPoints[i]) < min) {
                min = this.checkpointsCount.get(this.checkPoints[i]);
            }
        }
        this.laps = min;
    }
    /**
     * 
     * @returns true if the game is over
     */
    checkEndGame() {
        for (let i = 0; i < this.checkPoints.length; i++) {
            let checkpoint = this.checkPoints[i];
            if (i === 0 && this.checkpointsCount.get(checkpoint) < this.game.numberOfLaps + 1) {
                return false;

            } else if (this.checkpointsCount.get(this.checkPoints[i]) < this.game.numberOfLaps) {
                return false;
            }
        }
        this.gameOver = true;
        this.gameTime = Date.now() - this.game.startTime - this.timeInPause + this.game.penalties;
        return true;
    }

    /**
     * Turn the car left
     */
    left() {
        if (this.wheelRotation < this.maxRotation) {
            this.wheelRotation += this.rotateScale;
        }
    }

    /**
     * Turn the car right
     */
    right() {
        if (this.wheelRotation > this.minRotation) {
            this.wheelRotation -= this.rotateScale;
        }
    }

    /**
     * Accelerate the car
     */
    accelerate() {
        if (this.maxVelocity < 0) {
            if (this.velocity < 0.3) {
                this.velocity += this.acceleration;
            }
            else
                this.velocity = 0.3;
        } else {
            if (this.velocity < this.maxVelocity) {
                this.velocity += this.acceleration;
            }
            if (this.velocity >= this.maxVelocity) {
                this.velocity = this.maxVelocity;
            }
        }
        if (this.wheelRotation > 0.1 || this.wheelRotation < -0.1) this.rotation += this.wheelRotation * 0.06 * this.carRotationScale;
    }

    /**
     * Brake the car
     */
    brake() {
        if (this.velocity > this.minVelocity) {
            this.velocity -= this.acceleration;
        }
        if (this.wheelRotation > 0.1 || this.wheelRotation < -0.1) this.rotation += this.wheelRotation * 0.06 * this.carRotationScale;
    }

    /**
     * Pause the game
     */
    pause() {
        this.originalVelocity = this.velocity;
        this.velocity = 0;
        this.timePaused = Date.now();
    }

    /**
     * Continue the game
     */
    continue() {
        this.velocity = this.originalVelocity;
        this.timeInPause += Date.now() - this.timePaused;
    }

    /**
     * Handles the keys pressed, and updates the car
     */
    handleKeys() {
        if (!this.game.paused) {
            if ((this.game.keysPressed['a'] || this.game.keysPressed['arrowleft']) && !(this.game.keysPressed['d'] || this.game.keysPressed['arrowright'])) {
                if (!this.confused)
                    this.left();
                else
                    this.right();
            }

            if (this.game.keysPressed['d'] || this.game.keysPressed['arrowright'] && !(this.game.keysPressed['a'] || this.game.keysPressed['arrowleft'])) {
                if (!this.confused)
                    this.right();
                else
                    this.left();
            }

            if (this.game.keysPressed['w'] || this.game.keysPressed['arrowup'] && !(this.game.keysPressed['s'] || this.game.keysPressed['arrowdown'])) {
                if (!this.confused)
                    this.accelerate();
                else
                    this.brake();
            }

            if (this.game.keysPressed['s'] || this.game.keysPressed['arrowdown'] && !(this.game.keysPressed['w'] || this.game.keysPressed['arrowup'])) {
                if (!this.confused)
                    this.brake();
                else
                    this.accelerate();
            }
            if (!this.game.keysPressed['w'] && !this.game.keysPressed['arrowup'] && !this.game.keysPressed['s'] && !this.game.keysPressed['arrowdown']) {
                if (this.velocity > 0) {
                    this.velocity -= this.acceleration / 4;
                }
                else if (this.velocity <= 0) {
                    this.velocity = 0;
                }
            }
            if (!this.game.keysPressed['a'] && !this.game.keysPressed['arrowleft'] && !this.game.keysPressed['d'] && !this.game.keysPressed['arrowright']) {
                if (this.wheelRotation > 0) {
                    this.wheelRotation -= this.rotateScale;
                }
                else if (this.wheelRotation < 0) {
                    this.wheelRotation += this.rotateScale;
                }
                if (this.wheelRotation < 0.1 || this.wheelRotation > -0.1)
                    this.wheelRotation = 0;

            }

        }
    }


    /**
     * Updates the car position, rotation and velocity. Also checks if the car is inside the track and if it has collided with any object
     */
    update() {
        if (this.game.started && !this.game.paused && !this.gameOver) {
            this.handleKeys();

            const movementDirection = Math.sign(this.velocity);
            const rotationSpeed = Math.abs(this.velocity) * 0.8;

            this.car.children[0].children.forEach((wheel, index) => {
                wheel.children.forEach((w, subIndex) => {
                    if (subIndex === 0 || subIndex === 1) {
                        w.rotation.y = this.wheelRotation;
                    }
                    w.rotation.x += (movementDirection * Math.PI / 30) * rotationSpeed;

                });
            });

            this.car.rotation.y = this.rotation;
            const deltaPosition = new THREE.Vector3(
                this.velocity * Math.sin(this.car.rotation.y),
                0,
                this.velocity * Math.cos(this.car.rotation.y)
            );
            this.car.position.add(deltaPosition);

            // check if it's out of the track


            if (this.velocity != 0) {
                this.checkCollisions(this.obstacles, this.powerUps);
            }

            this.inside = this.checkInsideTrack();
            if (!this.inside && !this.velocityReduced) {
                this.valueDecreased = this.maxVelocity * 0.7;
                this.maxVelocity -= this.valueDecreased;
                this.velocityReduced = true;
            }
            else if (this.inside && this.velocityReduced) {
                this.maxVelocity += this.valueDecreased;
                this.velocityReduced = false;
            }

        }

    }

    /**
     * Checks if the car has collided with any object
     * @param {*} obstacles 
     * @param {*} powerUps 
     */
    checkCollisions(obstacles, powerUps) {
        for (const obstacle of obstacles) {
            const intersection = this.checkIntersection(this.car, obstacle);

            if (!this.obstaclesActivated.get(obstacle) && intersection) {
                this.game.obstacles.activateObstacle(this.game, obstacle);
                this.obstaclesActivated.set(obstacle, true);
            }
            else if (!intersection && this.obstaclesActivated.get(obstacle)) {
                this.obstaclesActivated.set(obstacle, false);
            }


        }

        const intersectionEnemy = this.checkIntersection(this.car, this.game.automaticVehicle.car);
        if (intersectionEnemy && !this.carsCollided) {
            this.changedVelocity = this.maxVelocity * 0.4;
            this.maxVelocity -= this.changedVelocity
            this.carsCollided = true;
            setTimeout(() => {
                this.maxVelocity += this.changedVelocity;
                this.carsCollided = false;
            }, 2000);
        }

        // Check collisions with power-ups
        for (const powerUp of powerUps) {
            if (!this.poweupsActivated.get(powerUp)) {
                const intersection = this.checkIntersection(this.car, powerUp);
                if (intersection) {
                    this.game.powerUps.activatePowerUp(this.game, powerUp);
                    this.poweupsActivated.set(powerUp, true);
                    powerUp.visible = false;
                    setTimeout(() => {
                        this.poweupsActivated.set(powerUp, false);
                        powerUp.visible = true;
                    }, 10000);
                }
            }
        }

        // Check collisions with checkpoints
        for (const checkpoint of this.checkPoints) {
            const intersection = this.checkIntersection(this.car, checkpoint);
            if (intersection && this.lastCheckpoint !== checkpoint) {
                let n = this.checkpointsCount.get(checkpoint);
                this.checkpointsCount.set(checkpoint, n + 1);
                this.checkPointCollided = true;
                this.lastCheckpoint = checkpoint;
                this.checkEndGame();
                this.updateNumberOfLaps();
            }
        }

    }

    /**
     * 
     * @returns true if the car is inside the track
     */
    checkInsideTrack() {
        const raycaster = new THREE.Raycaster();
        raycaster.set(this.car.position, new THREE.Vector3(0, -1, 0).normalize());

        const intersects = raycaster.intersectObject(this.track);

        // If there are intersections, check the texture of the first intersected object
        if (intersects.length == 0) {
            if (this.game.cutPath.visible) {
                const intersectsCut = raycaster.intersectObject(this.game.cutPath);
                if (intersectsCut.length > 0) return true;
            }
            return false;
        }
        return true;
    }



    /**
     * 
     * @param {*} object1 
     * @param {*} object2 
     * @returns true if the two objects intersect
     */
    checkIntersection(object1, object2) {

        // Get the bounding boxes of the two objects
        const box1 = new THREE.Box3().setFromObject(object1);
        const box2 = new THREE.Box3().setFromObject(object2);

        if (this.game.app.showBoundingBoxes) {
            if (this.helper1) {
                this.game.gameGroup.remove(this.helper1);
            }
            if (this.helperObj.get(object2)) {
                this.game.gameGroup.remove(this.helperObj.get(object2));
            }
            this.helper1 = new THREE.Box3Helper(box1, 0xffff00);
            this.game.gameGroup.add(this.helper1);
            this.helper2 = new THREE.Box3Helper(box2, 0xffff00);
            this.game.gameGroup.add(this.helper2);
            this.helperObj.set(object2, this.helper2);
        }
        else {
            if (this.helper1) {
                this.game.gameGroup.remove(this.helper1);
            }
            if (this.helperObj.get(object2)) {
                this.game.gameGroup.remove(this.helperObj.get(object2));
            }
        }

        if (box1.intersectsBox(box2)) {
            return true;
        }
        return false;
    }

    /*
    checkCarPosition(carPosition) {
        const textureWidth = 411;
        const textureHeight = 700;
        const threshold = 0.1; // Adjust this threshold as needed
    
        // Normalizar as coordenadas para as da textura
        const normalizedX = (carPosition.x - 38);
        const normalizedY = (carPosition.z - 29);
    
        console.log('normalizedX:', normalizedX);
        console.log('normalizedY:', normalizedY);
    
        // Criar canvas 
        const canvas = document.createElement('canvas');
        canvas.width = textureWidth;
        canvas.height = textureHeight;
        const context = canvas.getContext('2d');

    
        // Verificar se a imagem foi completamente carregada
        if (this.trackTexture && this.trackTexture.image && this.trackTexture.image.complete) {
            // Desenhar a imagem no canvas
            context.drawImage(this.trackTexture.image, 0, 0, 411, 700);
            document.body.appendChild(canvas);
    
 
            const imageData = context.getImageData(normalizedX, normalizedY, 1, 1).data;
            
            // Ler a cor da textura na posição (normalizedX, normalizedY)
            const textureColor = new THREE.Color(
                imageData[0] / 255,
                imageData[1] / 255,
                imageData[2] / 255
            );
            console.log(textureColor);
    
            // Comparar a cor da textura com a cor esperada, considerando o threshold
            return (
                textureColor.r  < threshold &&
                textureColor.g  < threshold &&
                textureColor.b  < threshold
            );

        } else {
            console.error('loading');
            return false;
        }
    }
    */

    /*
    checkInsideTrack(deltaPosition) {
        return this.checkCarPosition(deltaPosition);
    }
    */
}




export { MyVehicle };