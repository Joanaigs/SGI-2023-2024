import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Material
 */
class MyMaterial extends THREE.MeshPhongMaterial{

    constructor(materialData, texture ) {
        super();
        this.color = materialData.color;
        this.specular = materialData.specular;
        this.shininess = materialData.shininess;
        this.emissive  = materialData.emissive;
        this.wireframe = materialData.wireframe;
        this.texture = texture;
        this.textlength_s = materialData.texlength_s;
        this.texlength_t = materialData.texlength_t;
        this.side = (materialData.twosided)? THREE.DoubleSide: THREE.FrontSide;
        this.flatShading = (materialData.shading == "flat")? true : false;
        this.map = this.texture
    }



    updateMaterial(materialData, texture){
        this.specular = materialData.color;
        this.shininess = materialData.shininess;
        this.emissive  = materialData.emissive;
        this.wireframe = materialData.wireframe;     
        this.texture = texture;
        this.side = (materialData.twosided)? THREE.DoubleSide: THREE.FrontSide;     
    }

}


export { MyMaterial };