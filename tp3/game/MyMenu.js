import * as THREE from 'three';
import { MySkybox } from '../classes/MySkybox.js';
import { MyFont } from './MyFont.js';

/**
 *  This class contains a representation of the menu
 */
class MyMenu {
    constructor(app) {
        this.myFont = new MyFont();
        this.app = app;
        this.initMenuEnvironment();
        this.buildStartPage();
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
        const startButton = new THREE.Mesh(boxGeometry, boxMaterial);
        startButton.position.set(-1970, 249, -2490);

        const startWord = this.myFont.getWord("START"); // Assuming getWord is a method to create a 3D text object
        startWord.position.set(startButton.position.x + 3, startButton.position.y, startButton.position.z - 0.3);
        startWord.rotation.y = Math.PI;
        startWord.scale.set(1.5, 1.5, 1.5); // Use set method to set scale

        const feupName = this.myFont.getWord("FEUP"); // Assuming getWord is a method to create a 3D text object
        feupName.position.set(startButton.position.x + 0.5, startButton.position.y + 7, startButton.position.z);
        feupName.rotation.y = Math.PI;

        // Name of the game
        const gameName = this.myFont.getWord("SUGAR RUSH"); // Assuming getWord is a method to create a 3D text object
        gameName.position.set(startButton.position.x + 8, startButton.position.y + 5, startButton.position.z);
        gameName.rotation.y = Math.PI;
        gameName.scale.set(2, 2, 2); // Use set method to set scale

        const studentsName = this.myFont.getWord("Made by the students:"); // Assuming getWord is a method to create a 3D text object
        studentsName.position.set(startButton.position.x + 8, startButton.position.y - 5, startButton.position.z);
        studentsName.rotation.y = Math.PI;
        studentsName.scale.set(0.8, 0.8, 0.8);

        const inesName = this.myFont.getWord("Ines Cardoso up202005435"); // Assuming getWord is a method to create a 3D text object
        inesName.position.set(startButton.position.x + 9, startButton.position.y - 6, startButton.position.z);
        inesName.rotation.y = Math.PI;
        inesName.scale.set(0.8, 0.8, 0.8);

        const joanaName = this.myFont.getWord("Joana Santos up202005435"); // Assuming getWord is a method to create a 3D text object
        joanaName.position.set(startButton.position.x + 9, startButton.position.y - 7, startButton.position.z);
        joanaName.rotation.y = Math.PI;
        joanaName.scale.set(0.8, 0.8, 0.8);

        // Create a group to contain all the objects
        this.menuGroup = new THREE.Group();
        this.menuGroup.add(feupName, gameName, studentsName, inesName, joanaName, startButton, startWord);
        this.app.scene.add(this.menuGroup);
    }


    playerNamePage(){
        //this.app.scene.remove(this.menuGroup);

        const insertName = this.myFont.getWord("Insert Your Name"); // Assuming getWord is a method to create a 3D text object
        insertName.position.set(startButton.position.x + 8, startButton.position.y + 5, startButton.position.z);
        insertName.rotation.y = Math.PI;

        this.app.scene.add(insertName);
    }
}

export { MyMenu };
