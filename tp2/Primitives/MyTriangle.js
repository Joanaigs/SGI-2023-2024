import * as THREE from 'three';

/**
 * This class creates a Triangle
 */
class MyTriangle{

    constructor(primitiveData) {
        this.a = primitiveData.xyz1;
        this.b = primitiveData.xyz2;
        this.c = primitiveData.xyz3;
        this.triangle = new THREE.Triangle(this.a, this.b, this.c);
    }

    addMaterial(material){
        let object = new THREE.Mesh(this.triangle, material);
        return object
    }
}

export { MyTriangle };