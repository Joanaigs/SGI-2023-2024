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

/**
 *         // Define control points for half of the vase
        let controlPoints1 = [
            // U = 0
            [
                [-0.2, -1.0, 0.0, 1],
                [-0.2, -1.0, (4/3)*0.2, 1],
                [0.2,-1.0, (4/3)*0.2, 1],
                [0.2, -1.0, 0.0, 1],
            ],
            // U = 1
            [
                [-0.8, 0, 0, 1],
                [-0.8, 0, (4/3)*0.8, 1],
                [0.8, 0,  (4/3)*0.8, 1],
                [0.8, 0, 0, 1],
            ],
            // U = 2
            [
                [0.4, 0.8, 0.0, 1],
                [0.4, 0.8, -(4/3)*0.4, 1],
                [-0.4, 0.8, -(4/3)*0.4, 1],
                [-0.4, 0.8, 0.0, 1],
            ],
            // U = 3
            [
                [-0.4, 1.0, 0.0, 1],
                [-0.4, 1.0, (4/3)*0.4, 1],
                [0.4, 1.0, (4/3)*0.4, 1],
                [0.4, 1.0, 0.0, 1],
            ],
        ];
        this.nurb = this.builder.build(
            controlPoints1,
            orderU,
            orderV,
            20,
            20,
            this.material
        );
 */

export { MyNurbs };
