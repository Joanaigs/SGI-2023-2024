import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js'

/**
 * This class allows the creation of curbs
 */

class MyNurbs{

    /**
     * The constructor of the class that receives the data of the primitive
     * @param {Dictionary} primitiveData the data of the primitive
     */
    constructor(primitiveData) {
        this.builder = new MyNurbsBuilder();
        let points = []; 
        this.minlenght = 0
        this.maxLenght = Infinity
        this.minHeight = 0
        this.maxHeight = Infinity
    
        for (let i = 0; i <= primitiveData.degree_u; i++) {
            points[i] = [];
            for (let j = 0; j <= primitiveData.degree_v; j++) {
                let list = primitiveData.controlpoints[i * (primitiveData.degree_v+1) + j];
                points[i][j] = [list.xx, list.yy, list.zz, 1];
                if(list.xx>this.minlenght){
                    this.minlenght = list.xx
                }
                if(list.yy>this.minHeight){
                    this.minHeight = list.yy
                }
                if(list.xx<this.maxLenght){
                    this.maxLenght = list.xx
                }
                if(list.yy<this.maxHeight){
                    this.maxHeight = list.yy
                }
            }
        }
        this.nurb = this.builder.build(
            points,
            primitiveData.degree_u,
            primitiveData.degree_v,
            primitiveData.parts_u,
            primitiveData.parts_v,
            null
        );
    }
    

    /**
     * Adds the material to the nurb and returns the object
     * @param {MyMaterial} material the material of the nurb
     * @param {boolean} castshadow if the nurb casts shadow or not
     * @param {boolean} receiveshadows if the nurb receives shadow or not
     * @returns the object with the material
     */
    addMaterial(material, castshadow, receiveshadows){
        if(material.type !== "ShaderMaterial"){
            material.setRepeat(this.maxLenght-this.minlenght, this.maxHeight-this.minHeight)
        }
        let object = new THREE.Mesh(this.nurb, material);
        if(castshadow){
            object.castShadow = true;
        }
        if(receiveshadows){
            object.receiveShadow = true;
        }
        return object
    }

}

export { MyNurbs };
