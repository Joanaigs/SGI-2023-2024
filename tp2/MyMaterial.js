import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Material
 */
class MyMaterial extends THREE.MeshPhongMaterial{

    constructor(materialData, texture ) {
        super();
        this.texture = texture;
        this.side = (materialData.twosided)? THREE.DoubleSide: THREE.FrontSide;
        this.flatShading = (materialData.shading == "flat")? true : false;


        this.material = new THREE.MeshPhongMaterial({
            specular: materialData.color,
            shininess: materialData.shininess,
            emissive: materialData.emissive,
            wireframe: materialData.wireframe,
            map: this.texture,
            flatShading: this.flatShading
        });

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