import * as THREE from 'three';
import { MyTrack } from './gameBackground/MyTrack.js';
import { MyPowerUps } from './gameBackground/MyPowerUps.js';
import { MyObstacle } from './gameBackground/MyObstacle.js';
import { MyVehicle } from './MyVehicle.js';
import { MyRoute } from './MyRoute.js';
import { MyAutomaticVehicle } from './MyAutomaticVehicle.js';
/**
 *  This class contains the contents of out application
 */
class MyGame {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(logic, car, enemyCar, powerUps, obstacles, routes, cutPath) {
        this.logic = logic;
        this.app = logic.app
        this.scaleTrack = 50;
        this.startTime = Date.now();
        this.penalties = 0;
        this.position = new THREE.Vector3(-100, 0, -100);
        this.startPosition = new THREE.Vector3(8 * this.scaleTrack + this.position.x, 0, 5.5 * this.scaleTrack + this.position.z);

        this.powerUps = powerUps;
        this.obstacles = obstacles;
        this.routes = routes;
        this.cutPath = cutPath;
        this.car = new MyVehicle(this, this.position, new THREE.Vector3(8 * this.scaleTrack, 0, 5 * this.scaleTrack), car);
        this.automaticVehicle = new MyAutomaticVehicle(this, this.position, new THREE.Vector3(8 * this.scaleTrack, 0, 5 * this.scaleTrack), this.routes.getRoutes(1), enemyCar);
        this.gameOver = false;
        this.started = false;
        this.semaphoreColors = [0xff0000, 0xffff00, 0x00ff00]; // Red, Yellow, Gree
        this.semaphoreInterval = 1000; // Time in milliseconds for each color chang

        this.keysPressed = {};
        this.raycaster = new THREE.Raycaster()
        this.raycaster.near = 1
        this.raycaster.far = 70
        this.pointer = new THREE.Vector2()
        this.pickableObj = []
        this.paused = false

        this.createStartButton();
        this.pickingColor = "0x00ff00"

        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this),
            false
        );

        document.addEventListener('click', this.onClick.bind(this), false); // Update the event listener to listen for clicks
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));



    }

    createStartButton() {
        this.cylinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 32);
        this.bannerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.cylinder1 = new THREE.Mesh(this.cylinGeometry, this.bannerMaterial);
        this.cylinder1.position.set(this.startPosition.x - 20.5, 10, this.startPosition.z);
        this.app.scene.add(this.cylinder1);
        this.cylinder2 = new THREE.Mesh(this.cylinGeometry, this.bannerMaterial);
        this.cylinder2.position.set(this.startPosition.x + 20.5, 10, this.startPosition.z);
        this.app.scene.add(this.cylinder2);
        this.bannerTopGeometry = new THREE.BoxGeometry(41, 10, 1);
        this.bannerTop = new THREE.Mesh(this.bannerTopGeometry, this.bannerMaterial);
        this.bannerTop.position.set(this.startPosition.x, 15, this.startPosition.z);
        this.app.scene.add(this.bannerTop);
        this.boxGeometry = new THREE.BoxGeometry(10, 5, 1.1)
        this.button = new THREE.Mesh(this.boxGeometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }))
        this.button.position.set(this.startPosition.x - 10, 15, this.startPosition.z);
        this.button.name = "startButton"
        this.app.scene.add(this.button);
        this.pickableObj.push(this.button)

    }

    countDown() {
        this.app.scene.remove(this.button);
        this.semaphoreGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
        this.semaphoreMaterial = new THREE.MeshBasicMaterial({ color: this.semaphoreColors[0] });
        this.semaphore = new THREE.Mesh(this.semaphoreGeometry, this.semaphoreMaterial);
        this.semaphore.position.set(this.startPosition.x, 15, this.startPosition.z - 2);
        this.semaphore.rotateX(Math.PI / 2);
        this.app.scene.add(this.semaphore);

        this.semaphoreIntervalId = setInterval(() => {
            this.semaphore.material.color.setHex(this.semaphoreColors[1]);
            setTimeout(() => {
                this.semaphore.material.color.setHex(this.semaphoreColors[2]);
                setTimeout(() => {
                    this.semaphore.material.color.setHex(this.semaphoreColors[0]);
                    this.started = true;
                    this.start();
                    clearInterval(this.semaphoreIntervalId); // Stop the countdown loop
                    this.app.scene.remove(this.semaphore);
                }, this.semaphoreInterval);
            }, this.semaphoreInterval);
        }, this.semaphoreInterval * 3);



    }


    start() {
        this.automaticVehicle.start()

    }

    pause() {
        this.automaticVehicle.pause()
        this.car.pause()
    }

    continue() {
        this.automaticVehicle.continue()
        this.car.continue()
    }


    /**
     * Updates the scene
     */
    update() {
        this.car.update();
        this.automaticVehicle.update();

        if (this.app.activeCameraName == "car")
            this.updateCamera();
    }

    updateCamera() {
        // Set the camera position to follow the car
        const offset = new THREE.Vector3(0, 10, -30);
        const carPosition = this.car.car.position.clone();
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(this.car.rotation);

        // Apply the rotation to the offset vector
        offset.applyMatrix4(rotationMatrix);
        this.app.activeCamera.position.copy(carPosition.add(offset));

        // Set the camera to look at the car
        this.app.activeCamera.lookAt(this.car.car.position);
        this.app.controls.target = this.car.car.position;
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
        if (this.started && !this.gameOver) {
            if (!this.paused) {
                if ((this.keysPressed['a'] || this.keysPressed['arrowleft']) && !(this.keysPressed['d'] || this.keysPressed['arrowright'])) {
                    if (!this.car.confused)
                        this.car.left();
                    else
                        this.car.right();
                }

                if (this.keysPressed['d'] || this.keysPressed['arrowright'] && !(this.keysPressed['a'] || this.keysPressed['arrowleft'])) {
                    if (!this.car.confused)
                        this.car.right();
                    else
                        this.car.left();
                }

                if (this.keysPressed['w'] || this.keysPressed['arrowup'] && !(this.keysPressed['s'] || this.keysPressed['arrowdown'])) {
                    if (!this.car.confused)
                        this.car.accelerate();
                    else
                        this.car.brake();
                }

                if (this.keysPressed['s'] || this.keysPressed['arrowdown'] && !(this.keysPressed['w'] || this.keysPressed['arrowup'])) {
                    if (!this.car.confused)
                        this.car.brake();
                    else
                        this.car.accelerate();
                }
            }
            if(this.keysPressed[' ']){
                if(this.paused){
                    this.continue();
                    this.paused = false;
                }
                else{
                    this.pause();
                    this.paused = true;
                }
            }
        }
        if (this.keysPressed['escape']) {
            this.logic.state="menu";
        }

    }

    onClick() {
        // Raycast to check for intersection with the pickable objects
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
        const intersects = this.raycaster.intersectObjects(this.pickableObj);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            if (obj.name === "startButton") {
                this.countDown();
            }
        }
    }


    onPointerMove(event) {

        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);

        this.pickingHelper(intersects)
    }

    /*
* Helper to visualize the intersected object
*
*/
    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.pickableObj.includes(obj)) {
                this.changeColorOfFirstPickedObj(obj)
            }
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }

    /*
* Change the color of the first intersected object
*
*/
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }

    /*
        * Restore the original color of the intersected object
        *
        */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }
}

export { MyGame };