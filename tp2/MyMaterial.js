import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Material
 */
class MyMaterial extends THREE.Material{

    constructor(app, materialData ) {
        this.app = app;
        this.specular = materialData.color;
        this.shininess = materialData.shininess;
        this.emissive  = materialData.emissive;
        this.wireframe = materialData.wireframe;
        this.texture = this.app.getTexture(materialData.textureref);
    }

    updateMaterial(materialData){
        this.specular = materialData.color;
        this.shininess = materialData.shininess;
        this.emissive  = materialData.emissive;
        this.wireframe = materialData.wireframe;          
    }

}


export { MyMaterial };