import * as THREE from 'three';
import { MyFont } from '../MyFont.js';


/**
 *  This class contains the outdoor display
 */
class MyDisplayOutdoor extends THREE.Object3D {


    /**
     * The constructor of the class
     * @param {MyGame} game the game object 
     * @param {THREE.Vector3} position the position of the display 
     */
    constructor(game, position) {
        super();
        this.game = game;
        this.pos = position;
        this.lasTime = 0;
        this.lastLaps = 0;
        this.lastVelocity = 0;
        this.lastPenalty = 0;
        this.timeObstacle = 0;
        this.timePowerUp = 0;
        this.lastCarVelocity = 0;
        this.pause = false;
        this.font = new MyFont(false);
        this.normalVelTex = new THREE.TextureLoader().load('./textures/velocity_normal.png');
        this.powerupVelTex = new THREE.TextureLoader().load('./textures/velocity_powerup.png');
        this.obstacleVelTex = new THREE.TextureLoader().load('./textures/velocity_obstacle.png');
        this.colisionVelTex = new THREE.TextureLoader().load('./textures/velocity_colision.png');
        this.outsideVelTex = new THREE.TextureLoader().load('./textures/velocity_outside.png');

        //base
        const baseGeometry = new THREE.CylinderGeometry(5, 5, 50);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xffaaaa });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(this.pos.x, this.pos.y + 25, this.pos.z);
        this.add(base);

        //back
        const backGeometry = new THREE.BoxGeometry(100, 50, 10);
        const backMaterial = new THREE.MeshPhongMaterial({ color: 0xffaaaa });
        const back = new THREE.Mesh(backGeometry, backMaterial);
        back.position.set(this.pos.x, this.pos.y + 75, this.pos.z);
        this.add(back);

        //content
        this.content = new THREE.Group();
        const planeGeometry = new THREE.PlaneGeometry(90, 40, 200, 200);
        const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.content.add(plane);
        this.content.position.set(this.pos.x, this.pos.y + 75, this.pos.z - 6);
        this.content.rotateY(Math.PI);

        this.add(this.content);


        this.buildDisplay();
        this.rotation.y = -Math.PI / 2;

    }

    /**
     * Builds the display
     */
    buildDisplay() {
        this.hudGroup = new THREE.Group();

        // Create the time object
        this.timeGroup = new THREE.Group();
        this.hudGroup.add(this.timeGroup);

        // Create the laps object
        this.lapsGroup = new THREE.Group();
        this.lapsValue = this.font.getWord("0");
        this.lapsValue.scale.set(1.5, 1.5, 1.5);
        this.maxValue = this.font.getWord("/" + this.game.numberOfLaps.toString());
        this.maxValue.position.set(0.5, -0.25, 0);
        this.lapsGroup.add(this.maxValue);
        this.lapsGroup.add(this.lapsValue);
        this.lapsGroup.position.set(10, 0, 0);
        this.hudGroup.add(this.lapsGroup);

        // Create the velocity object
        this.velocityGroup = new THREE.Group();
        this.velocity = new THREE.Mesh(new THREE.PlaneGeometry(2, 1), new THREE.MeshBasicMaterial({ map: this.normalVelTex, transparent: true }));
        this.velocityValue = this.font.getWord("0");
        this.velocityValue.position.set(-0.2, -0.3, 0);
        this.velocityValue.scale.set(0.4, 0.4, 0.4);
        this.velocityText = this.font.getWord("km/h");
        this.velocityText.position.set(-0.1, -0.55, 0);
        this.velocityText.scale.set(0.15, 0.15, 0.15);
        this.velocityGroup.add(this.velocityText);
        this.velocityGroup.add(this.velocityValue);
        this.velocityGroup.add(this.velocity);
        this.velocityGroup.position.set(45 - 10, -20 + 10, 0.2);
        this.velocityGroup.scale.set(10, 10, 10);

        this.hudGroup.position.set(-45 + 10, 13, 1);
        this.hudGroup.scale.set(7, 7, 7);





        //PAUSed
        this.pausedGroup = new THREE.Group();
        this.paused = this.font.getWord("PAUSED");
        this.pausedGroup.add(this.paused);
        this.pausedGroup.position.set(-5, 0, 1);
        this.pausedGroup.scale.set(7, 7, 7);
        this.pausedGroup.visible = false;

        //PowerUps
        this.powerUpsGroup = new THREE.Group();
        this.powerUps = this.font.getWord("PowerUps");
        this.powerUpsGroup.add(this.powerUps);
        this.powerUpsVelocity = this.font.getWord("Velocity Timer:");
        this.powerUpsVelocity.position.set(1, -1, 0);
        this.powerUpsGroup.add(this.powerUpsVelocity);
        this.powerUpsGroup.position.set(-40, 5, 1);
        this.powerUpsGroup.scale.set(4, 4, 4);
        //this.powerUpsGroup.visible=false;
        // Obstacles
        this.obstaclesGroup = new THREE.Group();
        this.obstacles = this.font.getWord("Obstacles");
        this.obstaclesGroup.position.set(-40, -4, 1);
        this.obstaclesGroup.scale.set(4, 4, 4);
        this.obstaclesGroup.add(this.obstacles);
        this.obstaclesOffset = 1;

        // Add the group to the scene (assuming your scene is accessible from this.game.app)
        this.content.add(this.hudGroup);
        this.content.add(this.velocityGroup);
        this.content.add(this.powerUpsGroup);
        this.content.add(this.obstaclesGroup);
        this.content.add(this.pausedGroup);

    }

    /**
     * This function formats the time
     * @param {Number} milliseconds time in milliseconds 
     * @returns the time in the format mm:ss:ms
     */
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const millisecondsPart = Math.floor((milliseconds % 1000) / 10); // Take the first two digits

        return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(millisecondsPart)}`;
    }

    /**
     * Returns the number with two digits
     * @param {} number 
     * @returns 
     */
    padNumber(number) {
        return number < 10 ? `0${number}` : number.toString();
    }

    /**
     * Updates the display
     * @param {Number} time  the time
     * @param {Number} laps the laps
     * @param {Number} velocity the velocity
     * @param {Number} penalty  the penalty
     */
    update(time, laps, velocity, penalty) {
        //became biilboard(followCamera)
        if (this.game.paused) {
            this.pausedGroup.visible = true;


            return;
        }
        if (this.pausedGroup.visible) {
            this.pausedGroup.visible = false;
        }

        if (time != this.lasTime && !this.game.car.gameOver) {
            const formattedTime = this.formatTime(time);
            this.timeGroup.remove(this.timeValue);
            this.timeValue = this.font.getWord(formattedTime);
            this.timeGroup.add(this.timeValue)
            this.lasTime = time;
            if (penalty == 0) {
                this.timeGroup.remove(this.penalty);
                this.lastPenalty = 0;
            }
            if (penalty < 0) {
                this.timeGroup.remove(this.penalty);
                this.penalty = this.font.getWord("-" + this.formatTime((-penalty) * 1000), 0x00ff00);
                this.penalty.position.set(formattedTime.length + 1, 0, 0);
                this.timeGroup.add(this.penalty);
            }
        }

        if (laps != this.lastLaps) {
            this.lapsGroup.remove(this.lapsValue);
            this.lapsValue = this.font.getWord(laps.toString());
            this.lapsValue.scale.set(1.5, 1.5, 1.5);
            this.lapsGroup.add(this.lapsValue)
            this.lastLaps = laps;
        }
        if (velocity != this.lastVelocity) {
            if (velocity == 1) {
                this.velocity.material.map = this.normalVelTex;
            }
            if (velocity > 1)
                this.velocity.material.map = this.powerupVelTex;
            if (velocity >= 0.6 && velocity < 1)
                this.velocity.material.map = this.colisionVelTex;
            if (velocity >= 0.5 && velocity < 0.6)
                this.velocity.material.map = this.obstacleVelTex;
            if (velocity < 0.5)
                this.velocity.material.map = this.outsideVelTex;
        }
        if (this.game.car.velocity != this.lastCarVelocity) {
            this.velocityGroup.remove(this.velocityValue);
            this.velocityValue = this.font.getWord(Math.round(this.game.car.velocity * 100).toString());
            this.velocityValue.position.set(-0.2, -0.3, 0);
            this.velocityValue.scale.set(0.4, 0.4, 0.4);
            this.velocityGroup.add(this.velocityValue);
            this.lastCarVelocity = this.game.car.velocity;
        }

        if (this.game.powerUps.velovityTimeout) {
            this.powerUpsGroup.visible = "true"
            this.powerUpsGroup.remove(this.powerUpsVelocityValue);
            this.powerUpsVelocityValue = this.font.getWord(((this.game.powerUps.velovityTimeout - Date.now()) / 1000).toString());
            this.powerUpsVelocityValue.position.set(9, -1, 0);
            this.powerUpsGroup.add(this.powerUpsVelocityValue)
        }
        else if (this.powerUpsGroup.visible) {
            this.powerUpsGroup.visible = false
        }

        if (this.game.obstacles.velocityTimeout) {
            this.obstaclesGroup.visible = true
            if (!this.obstacleVelocity) {
                this.obstacleVelocity = this.font.getWord("Decreased Velocity:");
                this.obstaclesGroup.add(this.obstacleVelocity);
                this.obstacleVelocity.position.set(1, -this.obstaclesOffset, 0);
                this.obstacleVelocityOffset = this.obstaclesOffset;
                this.obstaclesOffset += 1;
            }
            this.obstaclesGroup.remove(this.obstaclesValueVelocity);
            this.obstaclesValueVelocity = this.font.getWord(((this.game.obstacles.velocityTimeout - Date.now()) / 1000).toString());
            this.obstaclesValueVelocity.position.set(11, -this.obstacleVelocityOffset, 0);
            this.obstaclesGroup.add(this.obstaclesValueVelocity)
        }
        else if (this.obstaclesValueVelocity) {
            this.obstaclesGroup.remove(this.obstacleVelocity)
            this.obstaclesGroup.remove(this.obstaclesValueVelocity)
            this.obstacleVelocity = null;
            this.obstaclesOffset -= 1;
            this.obstaclesValueVelocity = null;
        }
        if (this.game.obstacles.confusedTimeout) {
            this.obstaclesGroup.visible = true
            if (this.obstacleConfused == null) {
                this.obstacleConfused = this.font.getWord("Confused:");
                this.obstaclesGroup.add(this.obstacleConfused);
                this.obstacleConfused.position.set(1, -this.obstaclesOffset, 0);
                this.obstacleConfusedOffset = this.obstaclesOffset;
                this.obstaclesOffset += 1;
            }
            this.obstaclesGroup.remove(this.obstaclesValueConfused);
            this.obstaclesValueConfused = this.font.getWord(((this.game.obstacles.confusedTimeout - Date.now()) / 1000).toString());
            this.obstaclesValueConfused.position.set(6.5, -this.obstacleConfusedOffset, 0);
            this.obstaclesGroup.add(this.obstaclesValueConfused)
        } else if (this.obstaclesValueConfused) {
            this.obstaclesGroup.remove(this.obstacleConfused)
            this.obstaclesGroup.remove(this.obstaclesValueConfused)
            this.obstacleConfused = null;
            this.obstaclesOffset -= 1;
            this.obstaclesValueConfused = null;
        }
        if (this.game.obstacles.slipperyTimeout) {
            this.obstaclesGroup.visible = true
            if (!this.obstacleSlippery) {
                this.obstacleSlippery = this.font.getWord("Slippery:");
                this.obstaclesGroup.add(this.obstacleSlippery);
                this.obstacleSlippery.position.set(1, -this.obstaclesOffset, 0);
                this.obstacleSlipperyOffset = this.obstaclesOffset;
                this.obstaclesOffset += 1;
            }
            this.obstaclesGroup.remove(this.obstaclesValueSlippery);
            this.obstaclesValueSlippery = this.font.getWord(((this.game.obstacles.slipperyTimeout - Date.now()) / 1000).toString());
            this.obstaclesValueSlippery.position.set(6.5, -this.obstacleSlipperyOffset, 0);
            this.obstaclesGroup.add(this.obstaclesValueSlippery)
        }
        else if (this.obstaclesValueSlippery) {
            this.obstaclesGroup.remove(this.obstacleSlippery)
            this.obstaclesGroup.remove(this.obstaclesValueSlippery)
            this.obstacleSlippery = null;
            this.obstaclesOffset -= 1;
            this.obstaclesValueSlippery = null;
        }
        if (this.obstaclesOffset == 1 && this.obstaclesGroup.visible) {
            this.obstaclesGroup.visible = false
        }

    }

}

export { MyDisplayOutdoor };