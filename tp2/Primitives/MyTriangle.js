import * as THREE from 'three';

/**
 * This class creates a Triangle
 */
class MyTriangle{

    constructor(primitiveData) {
        this.a = primitiveData.xyz1;
        this.b = primitiveData.xyz2;
        this.c = primitiveData.xyz3;
        this.triangle = new THREE.BufferGeometry();
        const vertices = new Float32Array([
          this.a[0], this.a[1], this.a[2],
            this.b[0], this.b[1], this.b[2],
            this.c[0], this.c[1], this.c[2],
        ]);
        this.triangle.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  
    }

    addMaterial(material, castshadow, receiveshadows){
        this.triangle.computeVertexNormals();
        console.log(this.triangle);
        let object = new THREE.Mesh(this.triangle, material);
        if(castshadow){
            object.castShadow = true;
        }
        if(receiveshadows){
            object.receiveShadow = true;
        }
        return object
    }
}

export { MyTriangle };