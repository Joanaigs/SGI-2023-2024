import * as THREE from 'three';
import { MySkybox } from '../classes/MySkybox.js';
import { MyFont } from './MyFont.js';

/**
 *  This class contains the functions needed to allow the logic of the Menu
 */
class MyMenu {
    constructor(app) {
        this.myFont = new MyFont();
        this.app = app;
        this.input = null;
        this.playerCar = null;
        this.automaticCar = null;
        this.difficulty = null;
        this.clickableObjects = []
        this.initMenuEnvironment();
        this.buildStartPage();
        this.pressedButton = null;

        document.addEventListener('mousedown', (event) => {
            this.onDocumentMouseDown(event);
        });
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
                let remove = this.clickableObjects.indexOf(this.difficultyButton);
                this.clickableObjects.splice(remove, 1);
                this.choosePlayerCar();
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

        const joanaName = this.myFont.getWord("Joana Santos up202005435"); // Assuming getWord is a method to create a 3D text object
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
        this.difficultyPageGroup.add(chooseDifficulty, this.easyButton, easyWord, this.normalButton, normalWord, this.hardButton, hardWord, continueWord, this.difficultyButton);
        this.app.scene.add(this.difficultyPageGroup);
    }
    

    choosePlayerCar(){
        this.app.scene.remove(this.difficultyPageGroup);
    }
}

export { MyMenu };
