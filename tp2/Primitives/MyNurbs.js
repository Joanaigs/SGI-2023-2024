import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js'

/**
 * This class allows the creation of curbs
 */

class MyNurbs{

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
    

    addMaterial(material, castshadow, receiveshadows){
        material.setRepeat(this.maxLenght-this.minlenght, this.maxHeight-this.minHeight)
        console.log(this.maxLenght-this.minlenght, this.maxHeight-this.minHeight)
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
