import * as THREE from 'three';
import { MySkybox } from "./MySkybox.js"

/**
 * This class contains the scene object
 */
class MyScene extends THREE.Scene{
    /**
     * the constructor
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
    }

    /**
     * Updates the global attributes of the scene
     * @param {Dictionary} globalData a dictionary with the global attributes
     * @param {Dictionary} fog a dictionary with the fog attributes
     * @param {Dictionary} skyboxes a dictionary with the skybox attributes
     */
    updateGlobals(globalData, fog, skyboxes) {
        if(fog !== null){
            this.fog = new THREE.Fog(new THREE.Color(fog.color), fog.near, fog.far);
        }
        //ambient light
        if(globalData.ambient){
            const ambientLight = new THREE.AmbientLight(globalData.ambient, 1);
            this.add(ambientLight);
        }

        //skybox
        if(skyboxes){
            let skybox = new MySkybox(skyboxes.default)
            let skyboxObject = skybox.addSkybox();
            this.add(skyboxObject);
            this.app.skybox = skyboxObject;

        }

        //background
        this.background = new THREE.Color(globalData.background);
    }

}
export { MyScene };