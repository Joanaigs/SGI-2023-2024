import * as THREE from 'three';
import { MySkybox } from "./Primitives/MySkybox.js"


class MyScene extends THREE.Scene{
    constructor(app) {
        super();
        this.app = app;
    }
    updateGlobals(globalData, fog, skyboxes) {
        if(fog !== null){
            this.fog = new THREE.Fog(new THREE.Color(fog.color), fog.near, fog.far);
        }
        //ambient light
        if(globalData.ambient){
            const ambientLight = new THREE.AmbientLight(globalData.ambient, 0.5);
            this.add(ambientLight);
        }

        if(skyboxes){
            let skybox = new MySkybox(skyboxes.default)
            let skyboxObject = skybox.addSkybox();
            this.add(skyboxObject);

        }

        this.background = new THREE.Color(globalData.background);
    }

}
export { MyScene };