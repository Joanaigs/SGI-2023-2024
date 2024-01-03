import * as THREE from 'three';
import { MySkybox } from '../classes/MySkybox.js';
import { MyFont } from './MyFont.js';
import { MyPark } from './MyPark.js';
import { MyKeyboardListener } from './MyKeyboardListener.js';

/**
 *  This class contains the functions needed to allow the logic of the Menu
 */
class MyMenu {
    constructor(gameLogic) {
        this.myFont = new MyFont();
        this.myNonCenteredFont = new MyFont();
        this.gameLogic = gameLogic;
        this.app = this.gameLogic.app;
        this.input = null;
        this.playerCar = null;
        this.automaticCar = null;
        this.difficulty = null;
        this.clickableObjects = [];
        this.initMenuEnvironment();
        this.buildStartPage();

        this.pressedButton = null;

        document.addEventListener('mousedown', (event) => {
            this.onDocumentMouseDown(event);
        });
        document.addEventListener(
            "pointermove",(event) => {
                this.onPointerMove(event);
            });
        this.pickingColor = 0xFFC0CD;
    }

    resetClickableObjects() {
        while (this.clickableObjects.length > 0) {
            this.clickableObjects.pop();
        }
    }

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

    /*
    * Helper to visualize the intersected object
    *
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
        if (this.lastPickedObj){
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        }
        this.lastPickedObj = null;
    }

    
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
            if (intersects[0].object === this.startButton) {
                let remove = this.clickableObjects.indexOf(this.startButton);
                this.clickableObjects.splice(remove, 1);
                this.playerNamePage();
                this.canEnterName = true;
            } else if (intersects[0].object.name === "inputButton" ) {
                this.listener.removeEventListeners();
                let remove = this.clickableObjects.indexOf(this.nameButton);
                this.clickableObjects.splice(remove, 1);
                this.canEnterName = false;
                this.input = (this.input == "")? "player" : this.input;
                this.chooseDificultyPage();
            }
            else if(intersects[0].object.name === "hardButton"){
                this.difficulty = "hard";
                let remove = this.clickableObjects.indexOf(this.hardButton);
                this.clickableObjects.splice(remove, 1);
                this.hardButton.material.color.setHex(0xFF80AB); 
                this.easyButton.material.color.setHex(0xFFBCF2);
                this.normalButton.material.color.setHex(0xFFBCF2);
                if(this.lastPickedObj===this.hardButton){
                    this.lastPickedObj.currentHex = 0xFF80AB;
                    this.lastPickedObj.material.color.setHex(this.pickingColor);
                }
                this.clickableObjects.push(this.easyButton);
                this.clickableObjects.push(this.normalButton);
            }
            else if(intersects[0].object.name === "normalButton"){
                this.difficulty = "normal";
                let remove = this.clickableObjects.indexOf(this.normalButton);
                this.clickableObjects.splice(remove, 1);
                this.normalButton.material.color.setHex(0xFF80AB); 
                this.easyButton.material.color.setHex(0xFFBCF2);
                this.hardButton.material.color.setHex(0xFFBCF2);
                if(this.lastPickedObj===this.normalButton){
                    this.lastPickedObj.currentHex = 0xFF80AB;
                    this.lastPickedObj.material.color.setHex(this.pickingColor);
                }
                this.clickableObjects.push(this.easyButton);
                this.clickableObjects.push(this.hardButton);

            }
            else if(intersects[0].object.name === "easyButton"){
                this.difficulty = "easy";
                let remove = this.clickableObjects.indexOf(this.easyButton);
                this.clickableObjects.splice(remove, 1);
                this.easyButton.material.color.setHex(0xFF80AB); 
                this.normalButton.material.color.setHex(0xFFBCF2);
                this.hardButton.material.color.setHex(0xFFBCF2);
                if(this.lastPickedObj===this.easyButton){
                    this.lastPickedObj.currentHex = 0xFF80AB;
                    this.lastPickedObj.material.color.setHex(this.pickingColor);
                }
                this.clickableObjects.push(this.normalButton);
                this.clickableObjects.push(this.hardButton);
            }
            else if(intersects[0].object.name === "difficultyButton"){
                this.listener.removeEventListeners();
                this.resetClickableObjects();
                this.choosePlayerCar();
            }
            else if(intersects[0].object.name === "pinkTruck"){
                let remove = this.clickableObjects.indexOf(this.pinkTruck);
                this.clickableObjects.splice(remove, 1);
                this.playerCar = "pinkTruck";
                
                let pinkTruckPosition = this.playerPinkTruck.position;
                this.spotLight.position.set(pinkTruckPosition.x, pinkTruckPosition.y + 40, pinkTruckPosition.z);
                this.spotLight.target = this.playerPinkTruck;
            

                this.clickableObjects.push(this.playerCyanCar);
                this.clickableObjects.push(this.playerCyanTruck);
                this.clickableObjects.push(this.playerPinkCar);
                this.clickableObjects.push(this.playerCarButton);
            }
            else if(intersects[0].object.name === "cyanTruck"){
                this.playerCar = "cyanTruck";
                let remove = this.clickableObjects.indexOf(this.cyanTruck);
                this.clickableObjects.splice(remove, 1);

                this.spotLight.position.set(this.playerCyanTruck.position.x, this.playerCyanTruck.position.y + 40, this.playerCyanTruck.position.z);
                this.spotLight.target = this.playerCyanTruck;

                this.clickableObjects.push(this.playerPinkCar);
                this.clickableObjects.push(this.playerCyanCar);
                this.clickableObjects.push(this.playerPinkTruck);
                this.clickableObjects.push(this.playerCarButton);
            }
            else if(intersects[0].object.name === "cyanCar"){
                this.playerCar = "cyanCar";
                let remove = this.clickableObjects.indexOf(this.cyanCar);
                this.clickableObjects.splice(remove, 1);

                this.spotLight.position.set(this.playerCyanCar.position.x, this.playerCyanCar.position.y + 40, this.playerCyanCar.position.z);
                this.spotLight.target = this.playerCyanCar;

                this.clickableObjects.push(this.playerPinkCar);
                this.clickableObjects.push(this.playerCyanTruck);
                this.clickableObjects.push(this.playerPinkTruck);
                this.clickableObjects.push(this.playerCarButton);
            }
            else if(intersects[0].object.name === "pinkCar"){
                this.playerCar = "pinkCar";
                let remove = this.clickableObjects.indexOf(this.pinkCar);
                this.clickableObjects.splice(remove, 1);

                this.spotLight.position.set(this.playerPinkCar.position.x, this.playerPinkCar.position.y + 40, this.playerPinkCar.position.z);
                this.spotLight.target = this.playerPinkCar;

                this.clickableObjects.push(this.playerCyanCar);
                this.clickableObjects.push(this.playerCyanTruck);
                this.clickableObjects.push(this.playerPinkTruck);
                this.clickableObjects.push(this.playerCarButton);
            }
            else if(intersects[0].object.name === "playerCarButton"){
                this.resetClickableObjects();
                this.chooseBotCar();
            }
            else if(intersects[0].object.name === "botOrangeTruck"){
                let remove = this.clickableObjects.indexOf(this.botOrangeTruck);
                this.clickableObjects.splice(remove, 1);
                this.botCar = "orangeTruck";

                this.spotLight.position.set(this.botOrangeTruck.position.x, this.botOrangeTruck.position.y + 40, this.botOrangeTruck.position.z);
                this.spotLight.target = this.botOrangeTruck;
            
            
                this.clickableObjects.push(this.botRedCar);
                this.clickableObjects.push(this.botRedTruck);
                this.clickableObjects.push(this.botOrangeCar);
            }
            else if(intersects[0].object.name === "botRedTruck"){
                this.botCar = "redTruck";
                let remove = this.clickableObjects.indexOf(this.botRedTruck);
                this.clickableObjects.splice(remove, 1);

                this.spotLight.position.set(this.botRedTruck.position.x, this.botRedTruck.position.y + 40, this.botRedTruck.position.z);
                this.spotLight.target = this.botRedTruck;
            
                this.clickableObjects.push(this.botOrangeCar);
                this.clickableObjects.push(this.botOrangeTruck);
                this.clickableObjects.push(this.botRedCar);
            }
            else if(intersects[0].object.name === "botRedCar"){
                this.botCar = "redCar";
                let remove = this.clickableObjects.indexOf(this.botRedCar);
                this.clickableObjects.splice(remove, 1);

                this.spotLight.position.set(this.botRedCar.position.x, this.botRedCar.position.y + 40, this.botRedCar.position.z);
                this.spotLight.target = this.botRedCar;
            
                this.clickableObjects.push(this.botOrangeCar);
                this.clickableObjects.push(this.botOrangeTruck);
                this.clickableObjects.push(this.botRedTruck);
            }
            else if(intersects[0].object.name === "botOrangeCar"){
                this.botCar = "orangeCar";
                let remove = this.clickableObjects.indexOf(this.botOrangeCar);
                this.clickableObjects.splice(remove, 1);

                this.spotLight.position.set(this.botOrangeCar.position.x, this.botOrangeCar.position.y + 40, this.botOrangeCar.position.z);
                this.spotLight.target = this.botOrangeCar;
            
                this.clickableObjects.push(this.botRedCar);
                this.clickableObjects.push(this.botRedTruck);
                this.clickableObjects.push(this.botOrangeTruck);
            }
            else if(intersects[0].object.name === "botCarButton"){
                this.resetClickableObjects();
                this.app.scene.remove(this.spotLight)
                this.app.scene.remove(this.botParkScene);
                this.app.setActiveCamera(this.background);
                this.displayGameInfo();
            }
            else if(intersects[0].object.name === "startGameButton"){
                this.resetClickableObjects();
                this.gameLogic.username = this.input;
                this.gameLogic.difficulty = this.difficulty
                this.gameLogic.playerCar = this.playerCar;
                this.gameLogic.botCar = this.botCar;
                this.app.scene.remove(this.gameInfoPage);
                document.removeEventListener('mousedown', (event) => {
                    this.onDocumentMouseDown(event);
                });
                document.removeEventListener(
                    "pointermove",(event) => {
                        this.onPointerMove(event);
                    });
                this.gameLogic.state = "game";
            }
        }
    }


    initMenuEnvironment() {
        // Existing code for creating the first skybox
        const skyboxData2 = {
            size: [30, 30, 30],
            center: [-1970, 249, -2500],
            emissive: 0x963e9e,
            intensity: 4.0,
            up: './textures/up.jpg',
            down: './textures/dn.jpg',
            back: './textures/bk.jpg',
            left: './textures/lf.jpg',
            front: './textures/ft.jpg',
            right: './textures/rt.jpg',
        };

        const skybox2 = new MySkybox(skyboxData2);
        const skyboxMesh2 = skybox2.addSkybox();
        this.app.scene.add(skyboxMesh2);
    }

    buildStartPage() {
        // Create a box (cube) for the start button
        const boxGeometry = new THREE.BoxGeometry(10, 3, 0.5); // Adjust the size as needed
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.startButton = new THREE.Mesh(boxGeometry, boxMaterial);
        this.startButton.position.set(-1970, 249, -2490);
        this.clickableObjects.push(this.startButton);


        const startWord = this.myFont.getWord("START"); // Assuming getWord is a method to create a 3D text object
        startWord.position.set(this.startButton.position.x + 3, this.startButton.position.y, this.startButton.position.z - 0.3);
        startWord.rotation.y = Math.PI;
        startWord.scale.set(1.5, 1.5, 1.5); // Use set method to set scale

        const feupName = this.myFont.getWord("FEUP"); // Assuming getWord is a method to create a 3D text object
        feupName.position.set(this.startButton.position.x + 1.5, this.startButton.position.y + 7, this.startButton.position.z);
        feupName.rotation.y = Math.PI;

        // Name of the game
        const gameName = this.myFont.getWord("SUGAR RUSH"); // Assuming getWord is a method to create a 3D text object
        gameName.position.set(this.startButton.position.x + 8, this.startButton.position.y + 5, this.startButton.position.z);
        gameName.rotation.y = Math.PI;
        gameName.scale.set(2, 2, 2); // Use set method to set scale

        const studentsName = this.myFont.getWord("Made by the students:"); // Assuming getWord is a method to create a 3D text object
        studentsName.position.set(this.startButton.position.x + 7, this.startButton.position.y - 5, this.startButton.position.z);
        studentsName.rotation.y = Math.PI;
        studentsName.scale.set(0.8, 0.8, 0.8);

        const inesName = this.myFont.getWord("Ines Cardoso up202005435"); // Assuming getWord is a method to create a 3D text object
        inesName.position.set(this.startButton.position.x + 8, this.startButton.position.y - 6, this.startButton.position.z);
        inesName.rotation.y = Math.PI;
        inesName.scale.set(0.8, 0.8, 0.8);

        const joanaName = this.myFont.getWord("Joana Santos up202006279"); // Assuming getWord is a method to create a 3D text object
        joanaName.position.set(this.startButton.position.x + 8, this.startButton.position.y - 7, this.startButton.position.z);
        joanaName.rotation.y = Math.PI;
        joanaName.scale.set(0.8, 0.8, 0.8);

        // Create a group to contain all the objects
        this.menuGroup = new THREE.Group();
        this.menuGroup.add(feupName, gameName, studentsName, inesName, joanaName, this.startButton, startWord);
        this.app.scene.add(this.menuGroup);

    }

    createUsernameInput() {
        this.listener = new MyKeyboardListener(window);
    
        this.listener.onKeyPress((pressedKey) => {
            if (this.canEnterName) {
                this.input += pressedKey;

                if (this.wordMesh) {
                    this.app.scene.remove(this.wordMesh);
                }

                this.wordMesh = this.myNonCenteredFont.getWord(this.input);
                this.wordMesh.position.set(this.startButton.position.x + 4, this.startButton.position.y, this.startButton.position.z - 0.3);
                this.wordMesh.rotation.y = -Math.PI;
                this.wordMesh.scale.set(2, 2, 2);
                this.app.scene.add(this.wordMesh);
    
                this.canEnterName = false;
                setTimeout(() => {
                    this.canEnterName = true;
                }, 80);
            }
        });
    }


    playerNamePage(){
        this.app.scene.remove(this.menuGroup);

        const insertName = this.myFont.getWord("Insert Your Name"); // Assuming getWord is a method to create a 3D text object
        insertName.position.set(this.startButton.position.x + 6, this.startButton.position.y + 5, this.startButton.position.z);
        insertName.rotation.y = Math.PI;

        this.input = "";
        this.canEnterName = true;
        this.createUsernameInput();

        const boxGeometry = new THREE.BoxGeometry(3, 1, 0.5); // Adjust the size as needed
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.nameButton = new THREE.Mesh(boxGeometry, boxMaterial);
        this.nameButton.position.set(-1970, 246, -2490);
        this.nameButton.name = "inputButton"
        this.clickableObjects.push(this.nameButton);


        const continueWord = this.myFont.getWord("NEXT"); // Assuming getWord is a method to create a 3D text object
        continueWord.position.set(this.startButton.position.x+0.9, this.startButton.position.y-3, this.startButton.position.z - 0.3);
        continueWord.rotation.y = Math.PI;
        continueWord.scale.set(0.6, 0.6, 0.6)


        this.namePageGroup = new THREE.Group();
        this.namePageGroup.add(this.nameButton, continueWord,insertName );
        this.app.scene.add(this.namePageGroup);
    }

    chooseDificultyPage() {
        this.app.scene.remove(this.namePageGroup);
        this.app.scene.remove(this.wordMesh);

        const chooseDifficulty = this.myFont.getWord("Choose Game Difficulty"); // Assuming getWord is a method to create a 3D text object
        chooseDifficulty.position.set(this.startButton.position.x + 8, this.startButton.position.y + 7, this.startButton.position.z-2);
        chooseDifficulty.rotation.y = Math.PI;
    
        // Create a box (cube) for the easy button
        const easyButtonGeometry = new THREE.BoxGeometry(5, 2, 0.5);
        const easyButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.easyButton = new THREE.Mesh(easyButtonGeometry, easyButtonMaterial);
        this.easyButton.position.set(-1970, 253, -2490);
        this.easyButton.name = "easyButton";
        this.clickableObjects.push(this.easyButton);
    
        const easyWord = this.myFont.getWord("EASY");
        easyWord.position.set(this.easyButton.position.x+1, this.easyButton.position.y-0.5, this.easyButton.position.z-2);
        easyWord.rotation.y = Math.PI;
        easyWord.scale.set(0.7, 0.7, 0.7);
    
        // Create a box (cube) for the normal button
        const normalButtonGeometry = new THREE.BoxGeometry(5, 2, 0.5);
        const normalButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.normalButton = new THREE.Mesh(normalButtonGeometry, normalButtonMaterial);
        this.normalButton.position.set(-1970, 249, -2490);
        this.normalButton.name = "normalButton";
        this.clickableObjects.push(this.normalButton);
    
        const normalWord = this.myFont.getWord("NORMAL");
        normalWord.position.set(this.normalButton.position.x+1.7, this.normalButton.position.y, this.normalButton.position.z-2);
        normalWord.rotation.y = Math.PI;
        normalWord.scale.set(0.7, 0.7, 0.7);
    
        // Create a box (cube) for the hard button
        const hardButtonGeometry = new THREE.BoxGeometry(5, 2, 0.5);
        const hardButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.hardButton = new THREE.Mesh(hardButtonGeometry, hardButtonMaterial);
        this.hardButton.position.set(-1970, 245, -2490);
        this.hardButton.name = "hardButton";
        this.clickableObjects.push(this.hardButton);
    
        const hardWord = this.myFont.getWord("HARD");
        hardWord.position.set(this.hardButton.position.x+1, this.hardButton.position.y+0.1, this.hardButton.position.z-1);
        hardWord.rotation.y = Math.PI;
        hardWord.scale.set(0.7, 0.7, 0.7);

        // Create NEXT button
        const boxGeometry = new THREE.BoxGeometry(3, 1, 0.5); // Adjust the size as needed
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.difficultyButton = new THREE.Mesh(boxGeometry, boxMaterial);
        this.difficultyButton.position.set(-1970, 242, -2490);
        this.difficultyButton.name = "difficultyButton"
        this.clickableObjects.push(this.difficultyButton);

        const continueWord = this.myFont.getWord("NEXT"); // Assuming getWord is a method to create a 3D text object
        continueWord.position.set(this.startButton.position.x+0.9, this.startButton.position.y-7, this.startButton.position.z - 0.3);
        continueWord.rotation.y = Math.PI;
        continueWord.scale.set(0.6, 0.6, 0.6)

        // Create a group to contain all the buttons
        this.difficultyPageGroup = new THREE.Group();
        this.difficultyPageGroup.name = "difGroup";
        this.difficultyPageGroup.add(chooseDifficulty, this.easyButton, easyWord, this.normalButton, normalWord, this.hardButton, hardWord, continueWord, this.difficultyButton);
        this.app.scene.add(this.difficultyPageGroup);
    }
    

    choosePlayerCar(){
        this.app.scene.remove(this.difficultyPageGroup);
        this.app.scene.traverse(function (child) {
            if (child.name === "difGroup") {
                child.parent.remove(child);
            }
        });
        this.app.setActiveCamera("playerGarage2");

        this.playerParkScene = new THREE.Group();
        const playerPark = new MyPark();
        this.background = playerPark.initPark();
        this.shop = playerPark.buildPlayerPark();


        // Add button for each car
        this.playerPinkCar = playerPark.getPlayerCar(0);
        this.playerCyanCar = playerPark.getPlayerCar(1);
        this.playerCyanTruck = playerPark.getPlayerCar(2);
        this.playerPinkTruck = playerPark.getPlayerCar(3);
        this.playerPinkCar.name = "pinkCar";
        this.playerCyanCar.name = "cyanCar";
        this.playerCyanTruck.name = "cyanTruck";
        this.playerPinkTruck.name = "pinkTruck";
        this.clickableObjects.push(this.playerCyanCar);
        this.clickableObjects.push(this.playerPinkCar);
        this.clickableObjects.push(this.playerCyanTruck);
        this.clickableObjects.push(this.playerPinkTruck);

        this.spotLight = new THREE.SpotLight(0xffffff, 2, 100, Math.PI / 8, 0, 0);
        let pinkTruckPosition = this.playerPinkTruck.position;
        this.spotLight.position.set(pinkTruckPosition.x, pinkTruckPosition.y + 40, pinkTruckPosition.z);
        this.spotLight.target = this.playerPinkTruck;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 258
        this.spotLight.shadow.mapSize.height = 258
        this.spotLight.shadow.bias = 0.0001;


        this.playerCar = "pinkTruck";
        this.app.scene.add(this.spotLight);

        // Next Button
        const boxGeometry = new THREE.BoxGeometry(20, 10, 0.1); 
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.playerCarButton = new THREE.Mesh(boxGeometry, boxMaterial);
        this.playerCarButton.position.set(-2500, 140, -2650);
        this.playerCarButton.name = "playerCarButton"
        const continueWord = this.myFont.getWord("NEXT"); // Assuming getWord is a method to create a 3D text object
        continueWord.position.set(this.playerCarButton.position.x+7, this.playerCarButton.position.y, this.playerCarButton.position.z - 0.7);
        continueWord.rotation.y = Math.PI;
        continueWord.scale.set(5, 5, 5);
        this.clickableObjects.push(this.playerCarButton);

        // Save all elements on a variable
        this.playerParkScene.add(this.playerCarButton, continueWord, this.playerCyanCar, this.playerPinkCar, this.playerCyanTruck, this.playerPinkTruck, this.background, this.shop);
        this.app.scene.add(this.playerParkScene);
    }

    chooseBotCar(){
        this.botParkScene = new THREE.Group();
        const botPark = new MyPark();
        this.botBackground = botPark.initPark();
        this.botShop = botPark.buildBotPark();

        // Add button for each car
        this.botOrangeCar = botPark.getBotCar(0);
        this.botRedCar = botPark.getBotCar(1); 
        this.botRedTruck = botPark.getBotCar(2); 
        this.botOrangeTruck = botPark.getBotCar(3);
        this.botRedCar.name = "botRedCar";
        this.botOrangeCar.name = "botOrangeCar"; 
        this.botOrangeTruck.name = "botOrangeTruck"; 
        this.botRedTruck.name = "botRedTruck";
        this.clickableObjects.push(this.botRedCar);
        this.clickableObjects.push(this.botOrangeCar);
        this.clickableObjects.push(this.botOrangeTruck); 
        this.clickableObjects.push(this.botRedTruck); 

        
        let orangeTruckPosition = this.botOrangeTruck.position;
        this.spotLight.position.set(orangeTruckPosition.x, orangeTruckPosition.y + 40, orangeTruckPosition.z);
        this.spotLight.target = this.playerPinkTruck;
        this.botCar = "orangeTruck";
        

        // Next Button
        const boxGeometry = new THREE.BoxGeometry(20, 10, 0.1); 
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.botCarButton = new THREE.Mesh(boxGeometry, boxMaterial);
        this.botCarButton.position.set(-2500, 140, -2650);
        this.botCarButton.name = "botCarButton"
        this.clickableObjects.push(this.botCarButton);
        const continueWord = this.myFont.getWord("NEXT"); // Assuming getWord is a method to create a 3D text object
        continueWord.position.set(this.botCarButton.position.x+7, this.botCarButton.position.y, this.botCarButton.position.z - 0.2);
        continueWord.rotation.y = Math.PI;
        continueWord.scale.set(5, 5, 5);

        // Save all elements on a variable
        this.botParkScene.add(this.botCarButton, continueWord, this.botBackground, this.botShop, this.botRedCar, this.botOrangeCar, this.botOrangeTruck, this.botRedTruck);
        this.app.scene.add(this.botParkScene);
    }

    displayGameInfo(){
        this.app.scene.remove(this.botParkScene);
        this.app.setActiveCamera("menu");
        this.gameInfoPage = new THREE.Group();

        const gameInfoTitle = this.myFont.getWord("GAME INFO"); 
        gameInfoTitle.position.set(-1965, 256, -2490);
        gameInfoTitle.rotation.y = Math.PI;
    
        // Player username
        const playerUsernameWord = this.myFont.getWord("Player Username: ");
        playerUsernameWord.position.set(-1957, 253, -2490);
        playerUsernameWord.rotation.y = Math.PI;
        playerUsernameWord.scale.set(0.7, 0.7, 0.7);

        const playerUsernameInfo = this.myFont.getWord(this.input);
        playerUsernameInfo.position.set(-1969, 253, -2490);
        playerUsernameInfo.rotation.y = Math.PI;
        playerUsernameInfo.scale.set(0.7, 0.7, 0.7);

        // difficulty username
        const difficultyWord = this.myFont.getWord("Game Difficulty: ");
        difficultyWord.position.set(-1957, 250, -2490);
        difficultyWord.rotation.y = Math.PI;
        difficultyWord.scale.set(0.7, 0.7, 0.7);

        const difficultyInfo = this.myFont.getWord(this.difficulty);
        difficultyInfo.position.set(-1969, 250, -2490);
        difficultyInfo.rotation.y = Math.PI;
        difficultyInfo.scale.set(0.7, 0.7, 0.7);

        // playercar
        const playerCarWord = this.myFont.getWord("Player Vehicle: ");
        playerCarWord.position.set(-1957, 247, -2490);
        playerCarWord.rotation.y = Math.PI;
        playerCarWord.scale.set(0.7, 0.7, 0.7);

        const playerChoice = this.normalizeCarType(this.playerCar);
        const playerCarInfo = this.myFont.getWord(playerChoice);
        playerCarInfo.position.set(-1969, 247, -2490);
        playerCarInfo.rotation.y = Math.PI;
        playerCarInfo.scale.set(0.7, 0.7, 0.7);

        // botcar
        const botCarWord = this.myFont.getWord("Bot Vehicle: ");
        botCarWord.position.set(-1957, 244, -2490);
        botCarWord.rotation.y = Math.PI;
        botCarWord.scale.set(0.7, 0.7, 0.7);

        const botChoice = this.normalizeCarType(this.botCar);
        const botCarInfo = this.myFont.getWord(botChoice);
        botCarInfo.position.set(-1969, 244, -2490);
        botCarInfo.rotation.y = Math.PI;
        botCarInfo.scale.set(0.7, 0.7, 0.7);

        //startRace
        const boxGeometry = new THREE.BoxGeometry(8, 2, 0.1); 
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.startGameButton = new THREE.Mesh(boxGeometry, boxMaterial);
        this.startGameButton.position.set(-1969, 241, -2490);
        this.startGameButton.name = "startGameButton"

        const continueWord = this.myFont.getWord("START RACE!"); 
        continueWord.position.set(this.startGameButton.position.x+3.5, this.startGameButton.position.y, this.startGameButton.position.z - 0.2);
        continueWord.rotation.y = Math.PI;
        continueWord.scale.set(0.7, 0.7, 0.7);
        this.clickableObjects.push(this.startGameButton);

        this.gameInfoPage.add(gameInfoTitle, playerUsernameInfo, playerUsernameWord, difficultyWord, difficultyInfo, playerCarWord, playerCarInfo, botCarWord, botCarInfo, this.startGameButton, continueWord);
        this.app.scene.add(this.gameInfoPage);
    }

    normalizeCarType(carType){
        if(carType == "pinkTruck") return "Pink Truck"
        else if (carType == "cyanTruck") return "Cyan Truck"
        else if (carType == "orangeTruck") return "Orange Truck"
        else if(carType == "redTruck") return "Red Truck"
        else if (carType == "pinkCar") return "Pink Car"
        else if (carType == "cyanCar") return "Cyan Car"
        else if (carType == "orangeCar") return "Orange Car"
        else if (carType == "redCar") return "Red Car"
    }

}

export { MyMenu };
