import * as THREE from 'three';
import { MyVehicleObject } from './MyVehicleObject.js';



/**
 *  This class contains the contents of out application
 */
class MyVehicle {

    constructor(game, position, target) {

        
        this.game = game
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
        this.game.app.scene.add(this.car);
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

    }

    checkCollisions(obstacles, powerUps) {
        
        for (const obstacle of obstacles) {
            const intersection = this.checkIntersection(this.car, obstacle);
            if (intersection) {
                console.log('Collision with obstacle!');
            }
        }

        // Check collisions with power-ups
        for (const powerUp of powerUps) {
            const intersection = this.checkIntersection(this.car, powerUp);
            if (intersection) {
                console.log('Collision with power-up!');
            }
        }
    }

    checkInsideTrack(){
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
    
        if (this.velocity !== 0) {
            this.checkCollisions(this.game.obstacles.getObstacles(), this.game.powerUps.getPowerUps());
        }
    
        const movementDirection = Math.sign(this.velocity);
        const rotationSpeed = Math.abs(this.velocity) * 0.8;
    
        console.log(this.velocity);
    
        this.car.children[0].children.forEach(wheel => {
            wheel.children.forEach(w => {
                // Adjust the wheel rotation based on the movement direction and speed
                w.rotation.x += (movementDirection * Math.PI / 30) * rotationSpeed;
            });
        });
    }
    
    
    

    checkIntersection(object1, object2) {

        // Get the bounding boxes of the two objects
        const box1 = new THREE.Box3().setFromObject(object1);
        const box2 = new THREE.Box3().setFromObject(object2);
        
        if (box1.intersectsBox(box2)) {
            console.log('Intersection detected!');
            return true;
        }
        return false;
    }
    
    


}

export { MyVehicle };