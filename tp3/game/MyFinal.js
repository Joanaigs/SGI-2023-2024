import * as THREE from 'three';
import { MySkybox } from '../classes/MySkybox.js';
import { MyFirework } from './powerUps/MyFirework.js'

class MyFinal extends THREE.Object3D {
    constructor(gameLogic) {
        super();
        this.gameLogic = gameLogic;
        this.app = this.gameLogic.app;
        this.initScreenEnvironment();
        
    }   

    initScreenEnvironment() {
        const skyboxDataFinal = {
            size: [30, 30, 30],
            center: [-1970, 249, -3000],
            emissive: 0x963e9e,
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



}

export { MyFinal };