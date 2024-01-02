import * as THREE from 'three';
import { MySkybox } from '../classes/MySkybox.js';
import { MyFont } from './MyFont.js';
import { MyPark } from './MyPark.js';


/**
 *  This class contains the functions needed to allow the logic of the Menu
 */
class MyMenu {
    constructor(gameLogic) {
        this.myFont = new MyFont();
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
    }

    resetClickableObjects() {
        while (this.clickableObjects.length > 0) {
            this.clickableObjects.pop();
        }
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
            } else if (intersects[0].object.name === "inputButton" ) {
                let remove = this.clickableObjects.indexOf(this.nameButton);
                this.clickableObjects.splice(remove, 1);
                this.input = document.getElementById("username").value
                this.input = (document.getElementById("username").value == "")? "player": this.input;
                this.usernameInput.style.visibility = 'hidden';
                this.chooseDificultyPage();
            }
            else if(intersects[0].object.name === "hardButton"){
                this.difficulty = "hard";
                let remove = this.clickableObjects.indexOf(this.hardButton);
                this.clickableObjects.splice(remove, 1);
                this.hardButton.material.color.setHex(0xFF80AB); 
                this.easyButton.material.color.setHex(0xFFBCF2);
                this.normalButton.material.color.setHex(0xFFBCF2);
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
                this.clickableObjects.push(this.normalButton);
                this.clickableObjects.push(this.hardButton);
            }
            else if(intersects[0].object.name === "difficultyButton"){
                this.resetClickableObjects();
                this.choosePlayerCar();
            }
            else if(intersects[0].object.name === "pinkTrunk"){
                let remove = this.clickableObjects.indexOf(this.pinkTrunk);
                this.clickableObjects.splice(remove, 1);
                this.playerCar = "pinkTrunk";

                this.clickableObjects.push(this.playerCyanCar);
                this.clickableObjects.push(this.playerCyanTrunk);
                this.clickableObjects.push(this.playerPinkCar);
                this.clickableObjects.push(this.playerCarButton);
            }
            else if(intersects[0].object.name === "cyanTrunk"){
                this.playerCar = "cyanTrunk";
                let remove = this.clickableObjects.indexOf(this.cyanTrunk);
                this.clickableObjects.splice(remove, 1);

                this.clickableObjects.push(this.playerPinkCar);
                this.clickableObjects.push(this.playerCyanCar);
                this.clickableObjects.push(this.playerPinkTrunk);
                this.clickableObjects.push(this.playerCarButton);
            }
            else if(intersects[0].object.name === "cyanCar"){
                this.playerCar = "cyanCar";
                let remove = this.clickableObjects.indexOf(this.cyanCar);
                this.clickableObjects.splice(remove, 1);

                this.clickableObjects.push(this.playerPinkCar);
                this.clickableObjects.push(this.playerCyanTrunk);
                this.clickableObjects.push(this.playerPinkTrunk);
                this.clickableObjects.push(this.playerCarButton);
            }
            else if(intersects[0].object.name === "pinkCar"){
                this.playerCar = "pinkCar";
                let remove = this.clickableObjects.indexOf(this.pinkCar);
                this.clickableObjects.splice(remove, 1);

                this.clickableObjects.push(this.playerCyanCar);
                this.clickableObjects.push(this.playerCyanTrunk);
                this.clickableObjects.push(this.playerPinkTrunk);
                this.clickableObjects.push(this.playerCarButton);
            }
            else if(intersects[0].object.name === "playerCarButton"){
                this.resetClickableObjects();
                this.chooseBotCar();
            }
            else if(intersects[0].object.name === "botOrangeTrunk"){
                let remove = this.clickableObjects.indexOf(this.botOrangeTrunk);
                this.clickableObjects.splice(remove, 1);
                this.botCar = "orangeTrunk";
            
                this.clickableObjects.push(this.botRedCar);
                this.clickableObjects.push(this.botRedTrunk);
                this.clickableObjects.push(this.botOrangeCar);
            }
            else if(intersects[0].object.name === "botRedTrunk"){
                this.botCar = "redTrunk";
                let remove = this.clickableObjects.indexOf(this.botRedTrunk);
                this.clickableObjects.splice(remove, 1);
            
                this.clickableObjects.push(this.botOrangeCar);
                this.clickableObjects.push(this.botOrangeTrunk);
                this.clickableObjects.push(this.botRedCar);
            }
            else if(intersects[0].object.name === "botRedCar"){
                this.botCar = "redCar";
                let remove = this.clickableObjects.indexOf(this.botRedCar);
                this.clickableObjects.splice(remove, 1);
            
                this.clickableObjects.push(this.botOrangeCar);
                this.clickableObjects.push(this.botOrangeTrunk);
                this.clickableObjects.push(this.botRedTrunk);
            }
            else if(intersects[0].object.name === "botOrangeCar"){
                this.botCar = "orangeCar";
                let remove = this.clickableObjects.indexOf(this.botOrangeCar);
                this.clickableObjects.splice(remove, 1);
            
                this.clickableObjects.push(this.botRedCar);
                this.clickableObjects.push(this.botRedTrunk);
                this.clickableObjects.push(this.botOrangeTrunk);
            }
            else if(intersects[0].object.name === "botCarButton"){
                this.resetClickableObjects();
                this.displayGameInfo();
            }
            else if(intersects[0].object.name === "startGameButton"){
                this.resetClickableObjects();
                this.gameLogic.username = this.input;
                this.gameLogic.difficulty = this.difficulty
                this.gameLogic.playerCar = this.playerCar;
                this.gameLogic.botCar = this.botCar;
                document.removeEventListener('mousedown', (event) => {
                    this.onDocumentMouseDown(event);
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
        this.createUsernameInput(true);
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
        feupName.position.set(this.startButton.position.x + 0.5, this.startButton.position.y + 7, this.startButton.position.z);
        feupName.rotation.y = Math.PI;

        // Name of the game
        const gameName = this.myFont.getWord("SUGAR RUSH"); // Assuming getWord is a method to create a 3D text object
        gameName.position.set(this.startButton.position.x + 8, this.startButton.position.y + 5, this.startButton.position.z);
        gameName.rotation.y = Math.PI;
        gameName.scale.set(2, 2, 2); // Use set method to set scale

        const studentsName = this.myFont.getWord("Made by the students:"); // Assuming getWord is a method to create a 3D text object
        studentsName.position.set(this.startButton.position.x + 8, this.startButton.position.y - 5, this.startButton.position.z);
        studentsName.rotation.y = Math.PI;
        studentsName.scale.set(0.8, 0.8, 0.8);

        const inesName = this.myFont.getWord("Ines Cardoso up202005435"); // Assuming getWord is a method to create a 3D text object
        inesName.position.set(this.startButton.position.x + 9, this.startButton.position.y - 6, this.startButton.position.z);
        inesName.rotation.y = Math.PI;
        inesName.scale.set(0.8, 0.8, 0.8);

        const joanaName = this.myFont.getWord("Joana Santos up202006279"); // Assuming getWord is a method to create a 3D text object
        joanaName.position.set(this.startButton.position.x + 9, this.startButton.position.y - 7, this.startButton.position.z);
        joanaName.rotation.y = Math.PI;
        joanaName.scale.set(0.8, 0.8, 0.8);

        // Create a group to contain all the objects
        this.menuGroup = new THREE.Group();
        this.menuGroup.add(feupName, gameName, studentsName, inesName, joanaName, this.startButton, startWord);
        this.app.scene.add(this.menuGroup);

    }

    createUsernameInput(hidden) {
        this.usernameInput = document.createElement("input");
        this.usernameInput.setAttribute("type", "text");
        this.usernameInput.setAttribute("id", "username");
        this.usernameInput.setAttribute("name", "username");
        this.usernameInput.setAttribute("maxlength", "20");
        this.usernameInput.setAttribute("style", `
            position: absolute;
            top: 40%;
            left: 40%;
            width: 300px;
            height: 80px;
            font-size: 24px; /* Adjust the font size as needed */
            outline: none;
            visibility: ${hidden ? 'hidden' : 'visible'}; /* Initial visibility */
        `);
        document.body.appendChild(this.usernameInput);
    }


    playerNamePage(){
        this.app.scene.remove(this.menuGroup);
        this.usernameInput.style.visibility = 'visible';

        const insertName = this.myFont.getWord("Insert Your Name"); // Assuming getWord is a method to create a 3D text object
        insertName.position.set(this.startButton.position.x + 8, this.startButton.position.y + 5, this.startButton.position.z);
        insertName.rotation.y = Math.PI;

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

        const chooseDifficulty = this.myFont.getWord("Choose Game Difficulty"); // Assuming getWord is a method to create a 3D text object
        chooseDifficulty.position.set(this.startButton.position.x + 10, this.startButton.position.y + 7, this.startButton.position.z);
        chooseDifficulty.rotation.y = Math.PI;
    
        // Create a box (cube) for the easy button
        const easyButtonGeometry = new THREE.BoxGeometry(5, 2, 0.5);
        const easyButtonMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.easyButton = new THREE.Mesh(easyButtonGeometry, easyButtonMaterial);
        this.easyButton.position.set(-1970, 253, -2490);
        this.easyButton.name = "easyButton";
        this.clickableObjects.push(this.easyButton);
    
        const easyWord = this.myFont.getWord("EASY");
        easyWord.position.set(this.easyButton.position.x+1, this.easyButton.position.y-0.1, this.easyButton.position.z-1);
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
        normalWord.position.set(this.normalButton.position.x+1.7, this.normalButton.position.y, this.normalButton.position.z-1);
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
        this.app.setActiveCamera("playerGarage");

        this.playerParkScene = new THREE.Group();
        const playerPark = new MyPark();
        this.background = playerPark.initPark();
        this.shop = playerPark.buildPlayerPark();

        // Add button for each car
        this.playerPinkCar = playerPark.getPlayerCar(0);
        this.playerCyanCar = playerPark.getPlayerCar(1);
        this.playerCyanTrunk = playerPark.getPlayerCar(2);
        this.playerPinkTrunk = playerPark.getPlayerCar(3);
        this.playerPinkCar.name = "pinkCar";
        this.playerCyanCar.name = "cyanCar";
        this.playerCyanTrunk.name = "cyanTrunk";
        this.playerPinkTrunk.name = "pinkTrunk";
        this.clickableObjects.push(this.playerCyanCar);
        this.clickableObjects.push(this.playerPinkCar);
        this.clickableObjects.push(this.playerCyanTrunk);
        this.clickableObjects.push(this.playerPinkTrunk);

        // Next Button
        const boxGeometry = new THREE.BoxGeometry(20, 10, 0.1); 
        const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 });
        this.playerCarButton = new THREE.Mesh(boxGeometry, boxMaterial);
        this.playerCarButton.position.set(-2500, 140, -2650);
        this.playerCarButton.name = "playerCarButton"
        const continueWord = this.myFont.getWord("NEXT"); // Assuming getWord is a method to create a 3D text object
        continueWord.position.set(this.playerCarButton.position.x+7, this.playerCarButton.position.y, this.playerCarButton.position.z - 0.2);
        continueWord.rotation.y = Math.PI;
        continueWord.scale.set(5, 5, 5);
        this.clickableObjects.push(this.playerCarButton);

        // Save all elements on a variable
        this.playerParkScene.add(this.playerCarButton, continueWord, this.playerCyanCar, this.playerPinkCar, this.playerCyanTrunk, this.playerPinkTrunk, this.background, this.shop);
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
        this.botRedTrunk = botPark.getBotCar(2); 
        this.botOrangeTrunk = botPark.getBotCar(3);
        this.botRedCar.name = "botRedCar";
        this.botOrangeCar.name = "botOrangeCar"; 
        this.botOrangeTrunk.name = "botOrangeTrunk"; 
        this.botRedTrunk.name = "botRedTrunk";
        this.clickableObjects.push(this.botRedCar);
        this.clickableObjects.push(this.botOrangeCar);
        this.clickableObjects.push(this.botOrangeTrunk); 
        this.clickableObjects.push(this.botRedTrunk); 
        

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
        this.botParkScene.add(this.botCarButton, continueWord, this.botBackground, this.botShop, this.botRedCar, this.botOrangeCar, this.botOrangeTrunk, this.botRedTrunk);
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
        if (carType == "pinkCar") return "Pink Car"
        else if (carType == "cyanCar") return "Cyan Car"
        else if (carType == "orangeCar") return "Orange Car"
        else if (carType == "redCar") return "Red Car"

    }

}

export { MyMenu };
