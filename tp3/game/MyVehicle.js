import * as THREE from 'three';
import { MyVehicleObject } from './MyVehicleObject.js';


/**
 *  This class contains the contents of out application
 */
class MyVehicle {

    constructor(game, position, target, car) {


        this.game = game
        this.rotation = 0;
        this.laps=0;
        this.wheelRotation = 0;
        this.maxRotation = 0.6
        this.minRotation = -0.6;
        this.rotateScale = 0.1;
        this.velocity = 0;
        this.acceleration = 0.1;
        this.maxVelocity = 1.0;
        this.minVelocity = -0.5;
        this.confused = false;
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
        this.game.app.scene.add(this.car);


        this.trackTexture = new THREE.TextureLoader().load('./textures/track.png');
        
        this.renderTarget = new THREE.WebGLRenderTarget(411,700);

    }

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
        this.obstaclesActivated.set(obstacle, false);
    }

    checkCollisions(obstacles, powerUps) {
        for (const obstacle of obstacles) {
            const intersection = this.checkIntersection(this.car, obstacle);

            if (!this.obstaclesActivated.get(obstacle) && intersection) {
                console.log('Collision with obstacle!');
                this.game.obstacles.activateObstacle(this.game, obstacle);
                this.obstaclesActivated.set(obstacle, true);
            }
            else if (!intersection && this.obstaclesActivated.get(obstacle)) {
                this.obstaclesActivated.set(obstacle, false);
            }


        }

        // Check collisions with power-ups
        for (const powerUp of powerUps) {
            if (!this.poweupsActivated.get(powerUp)) {
                const intersection = this.checkIntersection(this.car, powerUp);
                if (intersection) {
                    console.log('Collision with power-up!');
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
                console.log("checkpoint: " + this.checkpointsCount.get(checkpoint));
                this.checkEndGame();
                this.updateNumberOfLaps();
            }
        }

    }
    updateNumberOfLaps(){
        let min = 5;
        for(let i = 0; i < this.checkPoints.length; i++){
            if(this.checkpointsCount.get(this.checkPoints[i]) < min){
                min = this.checkpointsCount.get(this.checkPoints[i]);
            }
        }
        this.laps = min;
    }
    checkEndGame() {
        for (let i = 0; i < this.checkPoints.length; i++) {
            let checkpoint = this.checkPoints[i];
            if (i === 0 && this.checkpointsCount.get(checkpoint) < this.game.numberOfLaps+1) {
                return false;

            } else if (this.checkpointsCount.get(this.checkPoints[i]) < this.game.numberOfLaps) {
                return false;
            }
        }
        this.game.gameOver();
        return true;
    }

    checkInsideTrack() {
        return false;
    }

    left() {
        if(this.wheelRotation < this.maxRotation){
            this.wheelRotation += this.rotateScale;
        }

        if (this.wheelRotation > 0.1 || this.wheelRotation < -0.1) this.rotation += this.wheelRotation * 0.06;


    }

    right() {
        if(this.wheelRotation > this.minRotation){
            this.wheelRotation -= this.rotateScale;
        }

        if (this.wheelRotation > 0.1 || this.wheelRotation < -0.1) this.rotation += this.wheelRotation * 0.06;
    }

    accelerate() {
        if (this.velocity < this.maxVelocity) {
            this.velocity += this.acceleration;
        }
        if(this.velocity>=this.maxVelocity){
            this.velocity=this.maxVelocity;
        }
    }

    brake() {
        if (this.velocity > this.minVelocity) {
            this.velocity -= this.acceleration;
        }
    }

    pause() {
        this.originalVelocity = this.velocity;
        this.velocity = 0;
    }

    continue() {
        this.velocity = this.originalVelocity;
    }

    handleKeys(){
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
            if(!this.game.keysPressed['w'] && !this.game.keysPressed['arrowup'] && !this.game.keysPressed['s'] && !this.game.keysPressed['arrowdown']){
                if(this.velocity>0){
                    this.velocity-=this.acceleration/4;
                }
                else if(this.velocity<=0){
                    this.velocity=0;
                }
            }
            if(!this.game.keysPressed['a'] && !this.game.keysPressed['arrowleft'] && !this.game.keysPressed['d'] && !this.game.keysPressed['arrowright']){
                if(this.wheelRotation>0){
                    this.wheelRotation-=0.03;
                }
                else if(this.wheelRotation<0){
                    this.wheelRotation+=0.03;
                }
                if(this.wheelRotation < 0.03 || this.wheelRotation > -0.03) 
                    this.wheelRotation = 0;

            }

        }
    }



    update() {
        if (this.game.started && !this.game.paused) {
            this.handleKeys();

            const movementDirection = Math.sign(this.velocity);
            const rotationSpeed = Math.abs(this.velocity) * 0.8;
    
            this.car.children[0].children.forEach(wheel => {
                wheel.children.forEach(w => {
                    w.rotation.y = this.wheelRotation;
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
         
            if (this.velocity != 0) {
                this.checkCollisions(this.obstacles, this.powerUps);
            }
            if(this.velocity>this.maxVelocity){
                this.velocity=this.maxVelocity;
            }
        }
    
        
    }
    
    

    checkIntersection(object1, object2) {

        // Get the bounding boxes of the two objects
        const box1 = new THREE.Box3().setFromObject(object1);
        const box2 = new THREE.Box3().setFromObject(object2);

        if (box1.intersectsBox(box2)) {
            return true;
        }
        return false;
    }

    checkCarPosition(carPosition) {
        const textureWidth = 411;
        const textureHeight = 700;
        const threshold = 0.1; // Adjust this threshold as needed
    
        // Normalizar as coordenadas para a textura
        const normalizedX = (carPosition.x - 38);
        const normalizedY = (carPosition.z - 29);// Inverter para corresponder à convenção three.js
    
        console.log('normalizedX:', normalizedX);
        console.log('normalizedY:', normalizedY);
    
        // Criar um canvas temporário
        const canvas = document.createElement('canvas');
        canvas.width = textureWidth;
        canvas.height = textureHeight;
        const context = canvas.getContext('2d');

    
        // Verificar se a imagem foi completamente carregada
        if (this.trackTexture && this.trackTexture.image && this.trackTexture.image.complete) {
            // Desenhar a imagem no canvas
            context.drawImage(this.trackTexture.image, 0, 0, 411, 700);
            document.body.appendChild(canvas);
    
            // Obter os dados da textura
            const imageData = context.getImageData(normalizedX, normalizedY, 1, 1).data;
            
            // Ler a cor da textura na posição (normalizedX, normalizedY)
            const textureColor = new THREE.Color(
                imageData[0] / 255,
                imageData[1] / 255,
                imageData[2] / 255
            );
            console.log(textureColor);
    
            // Compare a cor da textura com a cor esperada, considerando o threshold
            return (
                textureColor.r  < threshold &&
                textureColor.g  < threshold &&
                textureColor.b  < threshold
            );

        } else {
            // A imagem ainda está sendo carregada ou não existe
            console.error('A imagem ainda está sendo carregada ou não existe.');
            return false;
        }
    }
    

    checkInsideTrack(deltaPosition) {
        return this.checkCarPosition(deltaPosition);
    }
}
    
    


export { MyVehicle };