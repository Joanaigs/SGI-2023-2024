import * as THREE from 'three';
import { MyTrack } from './gameBackground/MyTrack.js';
import { MyPowerUps } from './gameBackground/MyPowerUps.js';
import { MyObstacle } from './gameBackground/MyObstacle.js';
import { MyVehicle } from './MyVehicle.js';
import { MyRoute } from './MyRoute.js';
import { MyAutomaticVehicle } from './MyAutomaticVehicle.js';
import { MyDisplay } from './MyDisplay.js';
/**
 *  This class contains the contents of out application
 */
class MyGame {

    /**
       constructs the object
       @param {MyApp} app The application object
    */
    constructor(logic, car, enemyCar, powerUps, obstacles, routes, cutPath, checkpoints) {
        this.logic = logic;
        this.app = logic.app
        this.scaleTrack = 50;
        this.startTime = Date.now();
        this.penalties = 0;
        this.position = new THREE.Vector3(-100, 0, -100);
        this.startPosition = new THREE.Vector3(8 * this.scaleTrack + this.position.x, 0, 5.5 * this.scaleTrack + this.position.z);

        this.powerUps = powerUps;
        this.obstacles = obstacles;
        this.obstaclesList = null;
        this.routes = routes;
        this.cutPath = cutPath;
        this.checkpoints = checkpoints;
        this.numberOfLaps = 3;
        this.car = new MyVehicle(this, this.position, new THREE.Vector3(8.2 * this.scaleTrack, 0, 5 * this.scaleTrack), car);
        this.automaticVehicle = new MyAutomaticVehicle(this, this.position, new THREE.Vector3(7.8 * this.scaleTrack, 0, 5 * this.scaleTrack), this.routes.getRoutes(1), enemyCar);
        this.gameOver = false;
        this.started = false;
        this.semaphoreColors = [0xff0000, 0xffff00, 0x00ff00]; // Red, Yellow, Gree
        this.semaphoreInterval = 1000; // Time in milliseconds for each color chang
        this.gameOver=false;

        this.keysPressed = {};
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.pickableObj = []
        this.paused = false
        this.selectedObstacle = null;


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


        this.display = new MyDisplay(this, this.position);
        this.app.scene.add(this.display);
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
        // Remove the button from the scene and add the semaphore
        let indexToRemove = this.pickableObj.indexOf(this.button);
        this.pickableObj.splice(indexToRemove, 1);
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

    changePositionObstacles() {
        this.pause();
        this.app.setActiveCamera('main');
        this.app.controls.target = this.app.cameraTarget['main'];

        this.obstaclesList = this.obstacles.getObstacles();
        console.log(this.obstaclesList)
        for (let i = 0; i < this.obstaclesList.length; i++) {
            this.pickableObj.push(this.obstaclesList[i]);
        }
        //create park
        this.obstaclesAvailable = this.obstacles.getObstaclesAvailable();
        for (let i = 0; i < this.obstaclesAvailable.length; i++) {
            this.pickableObj.push(this.obstaclesAvailable[i]);
            this.obstaclesAvailable[i].visible = true;
        }
        let saveButtonGeometry = new THREE.BoxGeometry(20, 1.1, 10)
        this.saveButton = new THREE.Mesh(saveButtonGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
        this.saveButton.position.set(3.5*this.scaleTrack + this.position.x, 0, 7.5*this.scaleTrack + this.position.z);
        this.app.scene.add(this.saveButton);
        this.pickableObj.push(this.saveButton)
    }

    changePositionObstaclesSave() {
        this.app.setActiveCamera('car');
        this.pickableObj = [];
        this.app.scene.remove(this.saveButton);
        for(let i=0;i<this.obstaclesAvailable.length;i++){
            this.obstaclesAvailable[i].visible = false;
        }
        this.continue();

    }


    /**
     * Updates the scene
     */
    update() {
        if(this.gameOver){
            this.logic.state = "gameOver";
            return;
        }
        this.car.update();
        this.automaticVehicle.update();

        if (this.app.activeCameraName === "car")
            this.updateCamera();
    }

    updateCamera() {
        // Set the camera position to follow the car
        const offset = new THREE.Vector3(0, 70, -120);
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
            if (this.keysPressed[' ']) {
                if (this.paused) {
                    this.continue();
                    this.paused = false;
                }
                else {
                    this.pause();
                    this.paused = true;
                }
            }
        }
        if (this.keysPressed['escape']) {
            this.logic.state = "menu";
        }

    }

    onClick() {
        if (this.selectedObstacle) {
            if(!this.obstaclesList.includes(this.selectedObstacle)){
                this.obstacles.addObstacle(this.selectedObstacle);
                this.car.addObstacle(this.selectedObstacle);
            }
            // If an obstacle is already selected, place it at the click position
            this.selectedObstacle.position.copy(this.selectedObstacle.position);
            this.selectedObstacle.position.y = 0; // Lower the obstacle back to the ground
            this.selectedObstacle = null; // Deselect the obstacle
            return;
        }
        // Raycast to check for intersection with the pickable objects
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
        const intersects = this.raycaster.intersectObjects(this.pickableObj);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            if (obj.name === "startButton") {
                this.countDown();
                return
            }
            else if (obj === this.saveButton) {
                this.changePositionObstaclesSave();
                return
            }
            // Check if the clicked object is an obstacle
            else if (this.obstaclesList.includes(obj)) {
                if (!this.selectedObstacle) {
                    // If no obstacle is selected, pick it up
                    this.selectedObstacle = obj;
                    this.selectedObstacle.position.y = 10; // Lift the obstacle above the ground
                } 
            }else if (this.obstaclesAvailable.includes(obj)) {
                if(!this.selectedObstacle){
                    this.obstaclesList.push(obj);
                    let objClone = obj.clone();
                    this.app.scene.add(objClone);
                    this.selectedObstacle = objClone
                    this.selectedObstacle.position.y = 10; // Lift the obstacle above the ground

                }
            }
        }
    }


    onPointerMove(event) {


        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        if (this.selectedObstacle) {
            // Calculate the new position for the selected obstacle based on the mouse movement
            this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
            const intersects = this.raycaster.intersectObjects([this.app.skybox]); // Use the ground as the dragging surface

            if (intersects.length > 0) {
                this.selectedObstacle.position.copy(intersects[0].point);
                this.selectedObstacle.position.y = 10; // Lift the obstacle above the ground
            }
            return;
        }


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
            else {
                this.restoreColorOfFirstPickedObj()
            }
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