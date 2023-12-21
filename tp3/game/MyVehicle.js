import * as THREE from 'three';
import { MyVehicleObject } from './MyVehicleObject.js';


/**
 *  This class contains the contents of out application
 */
class MyVehicle {

    constructor(game, position, target, car) {


        this.game = game
        this.rotation = 0;
        this.rotateScale = 0.1;
        this.velocity = 0;
        this.acceleration = 0.1;
        this.maxVelocity = 1;
        this.minVelocity = -0.5;
        this.confused = false;
        this.powerUps = this.game.powerUps.getPowerUps();
        this.obstacles = this.game.obstacles.getObstacles();
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

    }

    checkInsideTrack() {
        return false;
    }

    left() {
        this.checkInsideTrack() ? this.velocity = 0 : this.rotation += this.rotateScale;
    }

    right() {
        this.rotation -= this.rotateScale;
    }

    accelerate() {
        if (this.velocity < this.maxVelocity) {
            this.velocity += this.acceleration;
        }
    }

    brake() {
        if (this.velocity > this.minVelocity) {
            this.velocity -= this.acceleration;
        }
    }

    pause(){
        this.originalVelocity = this.velocity;
        this.velocity = 0;
    }

    continue(){
        this.velocity = this.originalVelocity;
    }


    update() {
        if (this.game.started || this.game.paused) {
            const deltaPosition = new THREE.Vector3(
                this.velocity * Math.sin(this.rotation),
                0,
                this.velocity * Math.cos(this.rotation)
            );
            this.car.position.add(deltaPosition);
            this.car.rotation.y = this.rotation;
            if (this.velocity != 0) {
                this.checkCollisions(this.obstacles, this.powerUps);
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




}

export { MyVehicle };