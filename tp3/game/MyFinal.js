import * as THREE from 'three';
import { MySkybox } from '../classes/MySkybox.js';
import { MyFirework } from './powerUps/MyFirework.js'
import { MyFont } from './MyFont.js';

/**
 * This class contains the final screen of the game
 */
class MyFinal extends THREE.Object3D {
    /**
     * The constructor for the final screen
     * @param {MyGameLogic} gameLogic the game logic object
     */
    constructor(gameLogic) {
        super();
        this.gameLogic = gameLogic;
        this.font = new MyFont();
        this.myNonCenteredFont = new MyFont(false);
        this.app = this.gameLogic.app;
        this.fireworks=[]
        this.camera = this.gameLogic.app.cameras['final'];

        this.clickableObjects = []
        document.addEventListener('mousedown', (event) => {
            this.onDocumentMouseDown(event);
        });
        document.addEventListener(
            "pointermove",(event) => {
                this.onPointerMove(event);
            });
        this.pickingColor = 0xFFC0CD;

        this.initScreenEnvironment();
        this.buildDisplayCamera(this.camera);
    }   

    /**
     * Resets the clickable objects
     */
    resetClickableObjects() {
        while (this.clickableObjects.length > 0) {
            this.clickableObjects.pop();
        }
    }

    /**
     * The pointer move event
     * @param {*} event 
     */
    onPointerMove(event) {

        this.pointer = new THREE.Vector2()
       
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();


        raycaster.setFromCamera(this.pointer, this.app.activeCamera);

        //3. compute intersections
        const intersects = raycaster.intersectObjects(this.clickableObjects);


        this.pickingHelper(intersects)
    }


    /**
     * Helper to visualize the intersected object
     * @param {*} intersects 
     */
    pickingHelper(intersects) {
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.clickableObjects.includes(obj)) {
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

            if (this.lastPickedObj != obj) {
                if (this.lastPickedObj)
                    this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
                this.lastPickedObj = obj;
                this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
                this.lastPickedObj.material.color.setHex(this.pickingColor);
            }
        
    }

    /**
    * Restore the original color of the intersected object
    *
    */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj){
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        }
        this.lastPickedObj = null;
    }

    /**
     * The mouse down event
     * @param {*} event 
     */
    onDocumentMouseDown(event) {
        // Calculate mouse coordinates in normalized device coordinates
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Create a raycaster
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.app.activeCamera);

        // Check for intersections with the button
        const intersects = raycaster.intersectObjects(this.clickableObjects);

        if (intersects.length > 0 && intersects[0].object) {
            if (intersects[0].object.name === "backToMenu") {
                this.camera.remove(this.finalGroup);
                this.app.scene.remove(this.skyboxMeshFinal);
                this.resetClickableObjects();
                this.gameLogic.state = "menu";
                this.reset();
            } else if (intersects[0].object.name === "tryAgain" ) {
                this.camera.remove(this.finalGroup);
                this.app.scene.remove(this.skyboxMeshFinal);
                this.resetClickableObjects();
                this.gameLogic.state = "game";
                this.reset();
            }
        }
    }

    /**
     * Initializes the screen environment
     */
    initScreenEnvironment() {
        const skyboxDataFinal = {
            size: [70, 50, 70],
            center: [-1970, 249, -3000],
            emissive: 0xC17CC7,
            intensity: 4.0,
            up: './textures/up.jpg',
            down: './textures/dn.jpg',
            back: './textures/bk.jpg',
            left: './textures/lf.jpg',
            front: './textures/ft.jpg',
            right: './textures/rt.jpg',
        };

        const skyboxFinal = new MySkybox(skyboxDataFinal);
        this.skyboxMeshFinal = skyboxFinal.addSkybox();
        this.app.scene.add(this.skyboxMeshFinal);
    }

    /**
     * Builds the display of the camera
     * @param {THREE.PerspectiveCamera} camera  the camera to display
     */
    buildDisplayCamera(camera) {
        this.finalGroup = new THREE.Group();

        let height = 2 * Math.tan(camera.fov * Math.PI / 360)*5;
        let width = height * camera.aspect;
        // Create the time object

        // Create the laps object
        this.winnerGroup = new THREE.Group(); 
        this.winnerWord = this.font.getWord("WINNER:");
        this.winnerWord.scale.set(0.9, 0.9, 0.9);
        this.winnerWord.position.set(-3.5, 3.5, -10);
        this.winnerGroup.add(this.winnerWord);

        this.winnerValue = this.font.getWord(this.gameLogic.winnerName);
        this.winnerValue.scale.set(0.9, 0.9, 0.9);
        this.winnerValue.position.set(0.3, 3.5, -10);
        this.winnerGroup.add(this.winnerValue);

        this.loserGroup = new THREE.Group();
        this.loserWord = this.font.getWord("LOSER:"); // Change "WINNER:" to "LOSER:"
        this.loserWord.scale.set(0.5, 0.5, 0.5);
        this.loserWord.position.set(-1.3, 2.7, -10);
        this.loserGroup.add(this.loserWord);

        this.loserValue = this.font.getWord(this.gameLogic.loserName);
        this.loserValue.scale.set(0.5, 0.5, 0.5);
        this.loserValue.position.set(0.5, 2.7, -10);
        this.loserGroup.add(this.loserValue);


        // game mode
        this.modeGroup = new THREE.Group();
        this.modeWord = this.myNonCenteredFont.getWord("MODE: ");
        this.modeWord.scale.set(0.3, 0.3, 0.3);
        this.modeWord.position.set(-0.5, 2.1, -10);
        this.modeGroup.add(this.modeWord);

        this.modeValue = this.myNonCenteredFont.getWord("normal");
        this.modeValue.scale.set(0.3, 0.3, 0.3);
        this.modeValue.position.set(0.3, 2.1, -10);
        this.modeGroup.add(this.modeValue);

        this.winnerGroup.translateX(0.5);
        this.loserGroup.translateX(-0.4);
        this.modeGroup.translateX(-0.8);

        //left is the loser
        this.loserInfoGroup = new THREE.Group();
        this.loserNameValue = this.myNonCenteredFont.getWord("LOSER STATS:");
        this.loserNameValue.scale.set(0.4, 0.4, 0.4);
        this.loserNameValue.position.set(-3.0, 0, -10);

        this.loserCarValue = this.myNonCenteredFont.getWord(this.gameLogic.loserCarName);
        this.loserCarValue.scale.set(0.3, 0.3, 0.3);
        this.loserCarValue.position.set(-3.0, -0.4, -10);

        this.loserTimeValue = this.myNonCenteredFont.getWord(this.gameLogic.loserTime);
        this.loserTimeValue.scale.set(0.3, 0.3, 0.3);
        this.loserTimeValue.position.set(-2.7, -0.7, -10);

        this.loserInfoGroup.add(this.loserNameValue, this.loserCarValue, this.loserTimeValue);

        //right is the winner
        this.winnerInfogroup = new THREE.Group();
        this.winnerNameValue = this.myNonCenteredFont.getWord("WINNER STATS:");
        this.winnerNameValue.scale.set(0.4, 0.4, 0.4);
        this.winnerNameValue.position.set(0.5, 0, -10);

        this.winnerCarValue = this.myNonCenteredFont.getWord(this.gameLogic.winnerCarName);
        this.winnerCarValue.scale.set(0.3, 0.3, 0.3);
        this.winnerCarValue.position.set(1.2, -0.4, -10);

        this.winnerTimeValue = this.myNonCenteredFont.getWord(this.gameLogic.winnerTime);
        this.winnerTimeValue.scale.set(0.3, 0.3, 0.3);
        this.winnerTimeValue.position.set(1.2, -0.7, -10);

        this.winnerInfogroup.add(this.winnerNameValue, this.winnerCarValue, this.winnerTimeValue);

        // Buttons to continue 
        this.buttons = new THREE.Group();
        const pinkMaterial1 = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        const pinkMaterial2 = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 })
        const rectangleGeometry = new THREE.PlaneGeometry(3, 1, 32);

        // Left rectangle
        this.leftRectangleMesh = new THREE.Mesh(rectangleGeometry, pinkMaterial1);
        this.leftRectangleMesh.position.set(-width / 2+3, -3.5, -10);
        this.leftRectangleMesh.name="tryAgain";
        const tryAgainValue = this.font.getWord("TRY AGAIN");
        tryAgainValue.position.set(this.leftRectangleMesh.x , this.leftRectangleMesh.y, this.leftRectangleMesh.z-2);
        tryAgainValue.scale.set(0.3, 0.3, 0.3);
        this.buttons.add(this.leftRectangleMesh, tryAgainValue);
        this.clickableObjects.push(this.leftRectangleMesh);
    
        // Right rectangle
        this.rightRectangleMesh = new THREE.Mesh(rectangleGeometry, pinkMaterial2);
        this.rightRectangleMesh.position.set(width / 2 -3, -3.5, -10); 
        this.rightRectangleMesh.name="backToMenu";
        const backToMenuValue = this.font.getWord("BACK TO MENU");
        backToMenuValue.scale.set(0.3, 0.3, 0.3);
        backToMenuValue.position.set(this.rightRectangleMesh.x , this.rightRectangleMesh.y, this.rightRectangleMesh.z-1);
        this.buttons.add(this.rightRectangleMesh, backToMenuValue);
        this.clickableObjects.push(this.rightRectangleMesh);
    


        this.finalGroup.add(this.modeGroup, this.winnerGroup, this.loserGroup, this.loserInfoGroup, this.winnerInfogroup, this.buttons);
        this.camera.add(this.finalGroup);
    }

    /**
     * Resets the final screen
     */
    reset(){
        for(let i = 0; i < this.fireworks.length; i++ ) {
            this.fireworks[i].reset()
        }
    }

    /**
     * Updates the fireworks.A new firework is added every 1% of the calls
     */
    update() {
 
        // add new fireworks every 1% of the calls
        if(Math.random()  < 0.01 ) {
            let firework = new MyFirework(this.app, this)
            this.fireworks.push(firework)
        }

        // for each fireworks 
        for( let i = 0; i < this.fireworks.length; i++ ) {
            // is firework finished?
            if (this.fireworks[i].done) {
                // remove firework 
                this.fireworks.splice(i,1) 
                continue 
            }
            // otherwise upsdate  firework
            this.fireworks[i].update()
        }
    }


}

export { MyFinal };