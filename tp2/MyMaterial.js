import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Material
 */
class MyMaterial extends THREE.MeshPhongMaterial{

    constructor(materialData, texture ) {
        super();
        console.log(texture);
        this.color = materialData.color;
        this.specular = materialData.specular;
        this.shininess = materialData.shininess;
        this.emissive  = materialData.emissive;
        this.wireframe = materialData.wireframe;
        this.textlength_s = materialData.texlength_s;
        this.texlength_t = materialData.texlength_t;
        this.side = (materialData.twosided)? THREE.DoubleSide: THREE.FrontSide;
        this.flatShading = (materialData.shading == "flat")? true : false;
        if(texture){
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(materialData.texlength_s, materialData.texlength_t);
            this.map = texture
        }
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