import * as THREE from 'three';
import { MySkybox } from '../classes/MySkybox.js';
import { MyFirework } from './powerUps/MyFirework.js'
import { MyFont } from './MyFont.js';

class MyFinal extends THREE.Object3D {
    constructor(gameLogic) {
        super();
        this.gameLogic = gameLogic;
        this.font = new MyFont();
        this.app = this.gameLogic.app;
        this.fireworks=[]
        this.camera = this.gameLogic.app.cameras['final'];
        console.log(this.camera);
        this.initScreenEnvironment();
        this.buildDisplayCamera(this.camera);
    }   

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
        const skyboxMeshFinal = skyboxFinal.addSkybox();
        this.app.scene.add(skyboxMeshFinal);
    }

    buildDisplayCamera(camera) {
        this.finalGroup = new THREE.Group();

        let height = 2 * Math.tan(camera.fov * Math.PI / 360)*5;
        let width = height * camera.aspect;
        // Create the time object

        // Create the laps object
        this.winnerGroup = new THREE.Group();
        this.winnerValue = this.font.getWord("BOT WINS!");
        this.winnerValue.scale.set(0.9, 0.9, 0.9);
        this.winnerValue.position.set(-3.0, 3, -10);
        this.winnerGroup.add(this.winnerValue);

        this.loserGroup = new THREE.Group();
        this.loserValue = this.font.getWord("PLAYER LOSES");
        this.loserValue.scale.set(0.4, 0.4, 0.4);
        this.loserValue.position.set(-2.0, 2.3, -10);
        this.loserGroup.add(this.loserValue);

        this.modeGroup = new THREE.Group();
        this.modeWord = this.font.getWord("MODE: ");
        this.modeWord.scale.set(0.4, 0.4, 0.4);
        this.modeWord.position.set(-2.0, 2.3, -10);
        this.modeGroup.add(this.modeWord);

        //left is the loser
        this.loserInfoGroup = new THREE.Group();
        this.loserNameValue = this.font.getWord("LOSER STATS:");
        this.loserNameValue.scale.set(0.4, 0.4, 0.4);
        this.loserNameValue.position.set(-3.6, 0, -10);

        this.loserCarValue = this.font.getWord("Cyan Truck");
        this.loserCarValue.scale.set(0.3, 0.3, 0.3);
        this.loserCarValue.position.set(-3.0, -0.4, -10);

        this.loserTimeValue = this.font.getWord("00:00:22");
        this.loserTimeValue.scale.set(0.3, 0.3, 0.3);
        this.loserTimeValue.position.set(-2.7, -0.7, -10);

        this.loserInfoGroup.add(this.loserNameValue, this.loserCarValue, this.loserTimeValue);

        //right is the winner
        this.winnerInfogroup = new THREE.Group();
        this.winnerNameValue = this.font.getWord("WINNER STATS:");
        this.winnerNameValue.scale.set(0.4, 0.4, 0.4);
        this.winnerNameValue.position.set(0.1, 0, -10);

        this.winnerCarValue = this.font.getWord("Cyan Truck");
        this.winnerCarValue.scale.set(0.3, 0.3, 0.3);
        this.winnerCarValue.position.set(1.2, -0.4, -10);

        this.winnerTimeValue = this.font.getWord("00:00:22");
        this.winnerTimeValue.scale.set(0.3, 0.3, 0.3);
        this.winnerTimeValue.position.set(1.2, -0.7, -10);

        this.winnerInfogroup.add(this.winnerNameValue, this.winnerCarValue, this.winnerTimeValue);

        // Buttons to continue 

        const pinkMaterial = new THREE.MeshBasicMaterial({ color: 0xFFBCF2 }); // Pink color
        const rectangleGeometry = new THREE.PlaneGeometry(3, 1, 32);

        // Left rectangle
        this.leftRectangleMesh = new THREE.Mesh(rectangleGeometry, pinkMaterial);
        this.leftRectangleMesh.position.set(-width / 2+3, -3.5, -10);
        this.leftRectangleMesh.name="tryAgain";
        const tryAgainValue = this.font.getWord("TRY AGAIN");
        tryAgainValue.position.set(this.leftRectangleMesh.x , this.leftRectangleMesh.y, this.leftRectangleMesh.z-2);
        tryAgainValue.scale.set(0.3, 0.3, 0.3);
        this.finalGroup.add(this.leftRectangleMesh, tryAgainValue);
    
        // Right rectangle
        this.rightRectangleMesh = new THREE.Mesh(rectangleGeometry, pinkMaterial);
        this.rightRectangleMesh.position.set(width / 2 -3, -3.5, -10); 
        this.rightRectangleMesh.name="backToMenu";
        const backToMenuValue = this.font.getWord("BACK TO MENU");
        backToMenuValue.scale.set(0.3, 0.3, 0.3);
        backToMenuValue.position.set(this.rightRectangleMesh.x , this.rightRectangleMesh.y, this.rightRectangleMesh.z);
        this.finalGroup.add(this.rightRectangleMesh, backToMenuValue);
    


        this.finalGroup.add(this.winnerGroup, this.loserGroup, this.loserInfoGroup, this.winnerInfogroup);
        this.camera.add(this.finalGroup);
    }

    update() {
 
        // add new fireworks every 5% of the calls
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