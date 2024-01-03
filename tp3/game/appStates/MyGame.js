import * as THREE from 'three';
import { MyTrack } from '../track/MyTrack.js';
import { MyPowerUps } from '../track/MyPowerUps.js';
import { MyObstacle } from '../track/MyObstacle.js';
import { MyVehicle } from '../vehicle/MyVehicle.js';
import { MyRoute } from '../track/MyRoute.js';
import { MyAutomaticVehicle } from '../vehicle/MyAutomaticVehicle.js';
import { MyDisplay } from '../gameBackground/MyDisplay.js';
import { MyFont } from '../MyFont.js';
import { MyOutdoor } from '../gameBackground/MyOutdoor.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyDisplayOutdoor } from '../gameBackground/MyDisplayOutdoor.js';
import { MyVehicleObject } from '../vehicle/MyVehicleObject.js';
import { MyCheckpoints } from '../track/MyCheckpoints.js';

/**
 *  This class contains the game
 */
class MyGame {

    /**
     * The Constructor for the game. Initializes the game and the game objects
     * @param {MyGameLogic} logic the logic of the game 
     * @param {MyVehicleObject} car the car of the player 
     * @param {MyVehicleObject} enemyCar the car of the enemy 
     * @param {MyPowerUps} powerUps the powerUps of the game 
     * @param {MyObstacle} obstacles the obstacles of the game 
     * @param {MyRoute} routes the routes of the game 
     * @param {THREE.Object3D} cutPath the cutPath of the game 
     * @param {MyCheckpoints} checkpoints the checkpoints of the game 
     * @param {THREE.Object3D} track  the track of the game
     * @param {Number} difficulty the difficulty of the game(time of the animation of the enemy car) 
     */
    constructor(logic, car, enemyCar, powerUps, obstacles, routes, cutPath, checkpoints, track, difficulty) {
        this.logic = logic;
        this.app = logic.app
        this.scaleTrack = 50;
        this.penalties = 0;
        this.numberOfLaps = 3;
        this.gameOver = false;
        this.started = false;
        this.powerUps = powerUps;
        this.obstacles = obstacles;
        this.obstaclesList = null;
        this.routes = routes;
        this.cutPath = cutPath;
        this.paused = false
        this.track = track;
        this.gameGroup = new THREE.Group();
        this.app.scene.add(this.gameGroup);


        this.powerUps.setGame(this);
        this.obstacles.setGame(this);
        this.position = new THREE.Vector3(-100, 0, -100);
        this.startPosition = new THREE.Vector3(8 * this.scaleTrack + this.position.x, 0, 5.5 * this.scaleTrack + this.position.z);


        this.checkpoints = checkpoints;
        this.car = new MyVehicle(this, this.position, new THREE.Vector3(8.2 * this.scaleTrack, 0, 5 * this.scaleTrack), car);
        let route;
        if(enemyCar.typeCar == "truck")
            route = this.routes.getRoutes(1);
        else
            route = this.routes.getRoutes(2);
        this.automaticVehicle = new MyAutomaticVehicle(this, this.position, new THREE.Vector3(7.8 * this.scaleTrack, 0, 5 * this.scaleTrack), route, enemyCar, difficulty);

        this.semaphoreColors = [0xff0000, 0xffff00, 0x00ff00]; // Red, Yellow, Gree
        this.semaphoreInterval = 1000; // Time in milliseconds for each color chang
        this.myFont = new MyFont(false);


        this.keysPressed = {};
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.pickableObj = []
        this.selectedObstacle = null;
        this.outdoor = new MyOutdoor(this.app, new THREE.Vector3(200, 2, 600));
        this.gameGroup.add(this.outdoor);
        this.pickingColor = "0x00ff00"
        this.pickingColorVector = new THREE.Vector3(0, 1, 0)

        document.addEventListener(
            "pointermove",
            this.onPointerMove.bind(this),
            false
        );
        document.addEventListener('click', this.onClick.bind(this), false);
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));

        const loader = new GLTFLoader();
        loader.load('./models/playerPark1.gltf', (gltf) => {
            this.playerCandyShop = gltf.scene;
            this.playerCandyShop.scale.set(40, 40, 40);
            this.playerCandyShop.rotation.y = Math.PI;
            this.playerCandyShop.position.set(75, -0.5, 300);
            this.playerCandyShop.visible = false;
            this.gameGroup.add(this.playerCandyShop);
        });

        this.countDown();




    }


    /**
     * Starts the countdown, then starts the game
     */
    countDown() {
        this.tourusGeometry = new THREE.TorusGeometry(41, 8, 48, 100);
        this.tourusMaterial = new THREE.MeshPhongMaterial({ color: 0xffaaaa });
        this.tourus = new THREE.Mesh(this.tourusGeometry, this.tourusMaterial);
        this.tourus.position.set(this.startPosition.x , 0-15, this.startPosition.z);
        this.tourus.castShadow = true;

        this.gameGroup.add(this.tourus);

        // Remove the button from the scene and add the semaphore
        this.semaphoreGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
        this.semaphoreMaterial = new THREE.MeshBasicMaterial({ color: this.semaphoreColors[0] });
        this.semaphore = new THREE.Mesh(this.semaphoreGeometry, this.semaphoreMaterial);
        this.semaphore.position.set(this.startPosition.x,25, this.startPosition.z - 8);
        this.semaphore.rotateX(Math.PI / 2);
        this.gameGroup.add(this.semaphore);

        this.semaphoreIntervalId = setInterval(() => {
            this.semaphore.material.color.setHex(this.semaphoreColors[1]);
            this.semaphoreIntervalId2 = setTimeout(() => {
                this.semaphore.material.color.setHex(this.semaphoreColors[2]);
                setTimeout(() => {
                    this.semaphore.material.color.setHex(this.semaphoreColors[0]);
                    this.started = true;
                    this.start();
                    clearInterval(this.semaphoreIntervalId); // Stop the countdown loop
                    clearInterval(this.semaphoreIntervalId2);
                    this.gameGroup.remove(this.semaphore);
                }, this.semaphoreInterval);
            }, this.semaphoreInterval);
        }, this.semaphoreInterval * 2);



    }


    /**
     * Starts the game
     */
    start() {
        this.started = true;
        this.display = new MyDisplay(this, 'followCar');
        this.displayOutdoor = new MyDisplayOutdoor(this, new THREE.Vector3(100, 2, 50));
        this.gameGroup.add(this.displayOutdoor);
        this.startTime = Date.now();
        this.automaticVehicle.start()
    }

    /**
     * Ends the game, only when both cars are finished
     */
    gameOverFinal() {
        this.gameOver = true;
        this.logic.state = "gameOver";
        if (this.car.gameTime < this.automaticVehicle.gameTime){
            this.botWon = false;
            this.winner = this.car.car;
            this.winnerTime = this.car.gameTime;
            this.loser = this.automaticVehicle.car;
            this.loserTime = this.automaticVehicle.gameTime;
        }
        else{
            this.botWon = true;
            this.loser = this.car.car;
            this.loserTime = this.car.gameTime;
            this.winner = this.automaticVehicle.car;
            this.winnerTime = this.automaticVehicle.gameTime;
        }

    }

    /**
     * Pauses the game
     */
    pause() {
        this.automaticVehicle.pause()
        this.car.pause()
        this.paused = true;
    }

    /**
     * Continues the game
     */
    continue() {
        this.automaticVehicle.continue()
        this.car.continue()
        this.paused = false;
    }

    /**
     * Changes the position of the obstacles. Two options: change the position of the obstacles or add a new obstacle
     */
    changePositionObstacles() {
        this.pause();
        this.app.setActiveCamera('pickObstacles');
        this.app.controls.target = this.app.cameraTarget['pickObstacles'];
        this.app.setActiveCamera('pickObstacles');


        this.obstaclesList = this.obstacles.getObstacles();
        for (let i = 0; i < this.obstaclesList.length; i++) {
            this.pickableObj.push(this.obstaclesList[i]);
        }
        //create park
        this.obstaclesAvailable = this.obstacles.getObstaclesAvailable();
        for (let i = 0; i < this.obstaclesAvailable.length; i++) {
            this.pickableObj.push(this.obstaclesAvailable[i]);
            this.obstaclesAvailable[i].visible = true;
        }
        this.playerCandyShop.visible = true;

        let saveButtonGeometry = new THREE.BoxGeometry(20, 1.1, 10)
        this.saveButton = new THREE.Mesh(saveButtonGeometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
        this.saveButton.position.set(2.95 * this.scaleTrack + this.position.x, 0, 7.4 * this.scaleTrack + this.position.z);
        let text = this.myFont.getChar(0, 1-2/16);
        this.saveButton.add(text);
        text.position.set(3, 5, 0);
        text.scale.set(10, 10, 10);
        text.rotation.x = Math.PI / 2 ;
        text.rotation.y = Math.PI;
        this.gameGroup.add(this.saveButton);
        this.pickableObj.push(this.saveButton)
    }

    /**
     * Saves the changes of the obstacles
     */
    changePositionObstaclesSave() {
        this.app.setActiveCamera('followCar');
        this.pickableObj = [];
        this.gameGroup.remove(this.saveButton);
        for (let i = 0; i < this.obstaclesAvailable.length; i++) {
            this.obstaclesAvailable[i].visible = false;
        }
        this.playerCandyShop.visible = false;
        this.continue();

    }


    /**
     * Updates the game. Updates all the objects of the game.
     */
    update() {
        if(!this.checkpoints.checkpointObjcts[0].visible && this.app.showcheckPoints){
            for (let i = 0; i < this.checkpoints.checkpointObjcts.length; i++) {
                this.checkpoints.checkpointObjcts[i].visible = true;
            }
        }else if(this.checkpoints.checkpointObjcts[0].visible && !this.app.showcheckPoints){
            for (let i = 0; i < this.checkpoints.checkpointObjcts.length; i++) {
                this.checkpoints.checkpointObjcts[i].visible = false;
            }
        }
        this.outdoor.update();
        this.powerUps.update();
        this.obstacles.update();

        if (this.display)
            this.display.update((Date.now() - this.startTime) - this.car.timeInPause, this.car.laps, this.car.maxVelocity, this.penalties);
        if(this.displayOutdoor)
            this.displayOutdoor.update((Date.now() - this.startTime) - this.car.timeInPause, this.car.laps, this.car.maxVelocity, this.penalties);
        this.car.update();
        this.automaticVehicle.update();


        if (this.app.activeCameraName === "followCar")
            this.updateCameraFollow();
        if (this.app.activeCameraName === "car")
            this.updateCamera();

        if (this.car.gameOver && this.automaticVehicle.gameOver)
            this.gameOverFinal();
    }

    /**
     * Updates the camera to follow the car
     */
    updateCameraFollow() {
        // Set the camera position to follow the car
        const offset = new THREE.Vector3(0, 20, -50);
        const carPosition = this.car.car.position.clone();
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(this.car.rotation);

        // Apply the rotation to the offset vector
        offset.applyMatrix4(rotationMatrix);
        this.app.activeCamera.position.copy(carPosition.add(offset));

        // Set the camera to look at the car
        this.app.activeCamera.lookAt(this.car.car.position.clone());
        this.app.controls.target = this.car.car.position.clone();
    }

    /**
     * Updates the camera to follow the car
     */
    updateCamera() {
        // Set the camera position to follow the car
        const offset = new THREE.Vector3(90, 20, 0); // Adjusted offset for left side
        const carPosition = this.car.car.position.clone();
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.makeRotationY(this.car.rotation);

        // Apply the rotation to the offset vector
        offset.applyMatrix4(rotationMatrix);
        this.app.activeCamera.position.copy(carPosition.add(offset));

        this.app.activeCamera.lookAt(this.car.car.position.clone());
        this.app.controls.target = this.car.car.position.clone();
    }

    /**
     *  Handles the keydown event
     * @param {*} event 
     */
    onKeyDown(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key] = true;
        this.handleKeys();
    }

    /**
     *  Handles the keyup event
     * @param {*} event 
     */
    onKeyUp(event) {
        const key = event.key.toLowerCase();
        this.keysPressed[key] = false;
        this.handleKeys();
    }

    /**
     * Handles the keys pressed
     */
    handleKeys() {
        if (this.started && !this.gameOver) {
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

    /**
     * Handles the click event
     */
    onClick() {
        if (this.selectedObstacle) {
            if (!this.obstaclesList.includes(this.selectedObstacle)) {
                this.obstacles.addObstacle(this.selectedObstacle);
                this.car.addObstacle(this.selectedObstacle);
                this.pickableObj.push(this.selectedObstacle);
                this.obstacles.materialList.push(this.selectedObstacle.material);
            }
            // If an obstacle is already selected, place it at the click position
            this.selectedObstacle.position.copy(this.selectedObstacle.position);
            this.selectedObstacle.position.y = 1; // Lower the obstacle back to the ground
            this.selectedObstacle = null; // Deselect the obstacle
            return;
        }
        // Raycast to check for intersection with the pickable objects
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);
        const intersects = this.raycaster.intersectObjects(this.pickableObj);

        if (intersects.length > 0) {
            const obj = intersects[0].object;
            if (obj === this.saveButton) {
                this.changePositionObstaclesSave();
                return
            }
            // Check if the clicked object is an obstacle
            else if (this.obstaclesList.includes(obj)) {
                if (!this.selectedObstacle) {
                    // If no obstacle is selected, pick it up
                    this.selectedObstacle = obj;
                    this.selectedObstacle.position.y = 1; // Lift the obstacle above the ground
                }
            } else if (this.obstaclesAvailable.includes(obj)) {
                if (!this.selectedObstacle) {
                    this.obstaclesList.push(obj);
                    let objClone = obj.clone();
                    this.gameGroup.add(objClone);
                    this.selectedObstacle = objClone
                    this.selectedObstacle.position.y = 1; // Lift the obstacle above the ground

                }
            }
        }
    }

    /**
     * Handles the pointer movement
     * @param {*} event 
     */
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
                this.selectedObstacle.position.y = 1; // Lift the obstacle above the ground
            }
            return;
        }


        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

        //3. compute intersections
        var intersects2 = this.raycaster.intersectObjects(this.pickableObj);

        this.pickingHelper(intersects2)
    }

    /**
    * Helper to visualize the intersected object
    *
    */
    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.pickableObj.includes(obj)) {
                this.changeColorOfFirstPickedObj(obj)
            }
        }
        else {
            this.restoreColorOfFirstPickedObj()
        }
    }

    /**
    * Change the color of the first intersected object
    *
    */
    changeColorOfFirstPickedObj(obj) {
        if (obj.material.type === "ShaderMaterial") {
            if (this.lastPickedObj) {
                this.lastPickedObj.material.uniforms['baseColor'].value = this.lastPickedObj.currentHex;
            }
            this.lastPickedObj = obj;
            this.lastPickedObj.material.uniforms['scale'].value = 0.8;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.uniforms['baseColor'].value;
            this.lastPickedObj.material.uniforms['baseColor'].value = this.pickingColorVector;
        } else {
            if (this.lastPickedObj != obj) {
                if (this.lastPickedObj)
                    this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
                this.lastPickedObj = obj;
                this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
                this.lastPickedObj.material.color.setHex(this.pickingColor);
            }
        }
    }

    /**
    * Restore the original color of the intersected object
    *
    */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj){
            if(this.lastPickedObj.material.type === "ShaderMaterial"){
                this.lastPickedObj.material.uniforms['baseColor'].value = this.lastPickedObj.currentHex;  
                this.lastPickedObj.material.uniforms['scale'].value = 0.0;  
            }else
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        }
        this.lastPickedObj = null;
    }

    /**
     * Resets the game
     */
    reset(){
        this.app.scene.remove(this.gameGroup);
        this.display.reset();

    }
}

export { MyGame };