import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Box
 */
class MyBox extends THREE.BoxGeometry{

    constructor(primitiveData) {
        super();
        this.width = Math.abs(primitiveData.xyz1[0] - primitiveData.xyz1[0]);
        this.height = Math.abs(primitiveData.xyz1[1] - primitiveData.xyz1[1]);
        this.depth = Math.abs(primitiveData.xyz1[2] - primitiveData.xyz1[2]);
        this.widthSegments = primitiveData.parts_x;
        this.heigthSegments = primitiveData.parts_y;
        this.depthSegments = primitiveData.parts_z;

    }

    addMaterial(material){
        let object = new THREE.Mesh(this, material);
        return object
    }

}

export { MyBox };