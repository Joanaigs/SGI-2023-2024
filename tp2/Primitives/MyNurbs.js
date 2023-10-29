import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js'

/**
 * This class allows the creation of curbs
 */

class MyNurbs{

    constructor(primitiveData) {
        this.builder = new MyNurbsBuilder();
        let points = []; 
    
        for (let i = 0; i <= primitiveData.degree_u; i++) {
            points[i] = [];
            for (let j = 0; j <= primitiveData.degree_v; j++) {
                let list = primitiveData.controlpoints[i * (primitiveData.degree_u + 1) + j];
                points[i][j] = [list.xx, list.yy, list.zz, 1];
            }
        }
        console.log(points)
    
        this.nurb = this.builder.build(
            points,
            primitiveData.degree_u,
            primitiveData.degree_v,
            primitiveData.parts_u,
            primitiveData.parts_v,
            null
        );
    }
    

    addMaterial(material){
        let object = new THREE.Mesh(this.nurb, material);
        return object
    }

}

export { MyNurbs };
