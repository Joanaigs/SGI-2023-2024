import * as THREE from 'three';

/**
 * This class creates a Triangle
 */
class MyTriangle extends THREE.TriangleGeometry{

    constructor(primitiveData) {
        super();
        this.a = primitiveData.xyz1;
        this.b = primitiveData.xyz2;
        this.c = primitiveData.xyz3;
    }

    addMaterial(material){
        let object = new THREE.Mesh(this, material);
        return object
    }
}

export { MyTriangle };