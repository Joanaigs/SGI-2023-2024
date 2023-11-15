import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js'

/**
 * This class allows the creation of curbs
 */

class MyNurbs{

    constructor(primitiveData) {
        this.builder = new MyNurbsBuilder();
        let points = []; 
        this.lenght = 0
        this.height = 0
    
        for (let i = 0; i <= primitiveData.degree_u; i++) {
            points[i] = [];
            for (let j = 0; j <= primitiveData.degree_v; j++) {
                let list = primitiveData.controlpoints[i * (primitiveData.degree_v+1) + j];
                points[i][j] = [list.xx, list.yy, list.zz, 1];
                if(list.xx>this.lenght){
                    this.lenght = list.xx
                }
                if(list.yy>this.height){
                    this.height = list.yy
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
        material.setRepeat(this.lenght, this.height)
        console.log(this.lenght, this.height)
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
