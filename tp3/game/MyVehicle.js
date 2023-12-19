import * as THREE from 'three';
import { MyVehicleObject } from './MyVehicleObject.js';
/**
 *  This class contains the contents of out application
 */
class MyVehicle {


    constructor(app, position, target) {
        this.app = app
        this.rotation = 0;
        this.rotateScale = 0.3;
        this.velocity = 0;
        this.acceleration = 0.1;
        this.maxVelocity = 1;
        this.minVelocity = -0.5;
        this.keysPressed = {};
        this.car = new MyVehicleObject();
        this.car.position.set(position.x, position.y, position.z);
        this.car.position.add(target);
        this.app.scene.add(this.car);
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

    }


    left() {
        this.rotation += this.rotateScale;
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

    onKeyDown(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key] = true;
        this.handleKeys();
    }

    onKeyUp(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key] = false;
        this.handleKeys();
    }

    handleKeys() {
        if (this.keysPressed['a'] || this.keysPressed['arrowleft']) {
            this.left();
            console.log("left");
        }

        if (this.keysPressed['d'] || this.keysPressed['arrowright']) {
            this.right();
        }

        if (this.keysPressed['w'] || this.keysPressed['arrowup']) {
            this.accelerate();
        }

        if (this.keysPressed['s'] || this.keysPressed['arrowdown']) {
            this.brake();
        }
    }

    update() {
        const deltaPosition = new THREE.Vector3(
            this.velocity * Math.sin(this.rotation),
            0,
            this.velocity * Math.cos(this.rotation)
        );
        this.car.position.add(deltaPosition);
        this.car.rotation.y = this.rotation;
    }


}

export { MyVehicle };