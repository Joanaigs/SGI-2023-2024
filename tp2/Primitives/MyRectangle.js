import * as THREE from 'three';

/**
 * This class creates a Rectangle
 */
class MyRectangle extends THREE.PlaneGeometry{

    constructor(primitiveData) {
        super();
        this.width = Math.abs(primitiveData.xy1[0] - primitiveData.xy1[0]);
        this.height = Math.abs(primitiveData.xyz1[1] - primitiveData.xyz1[1]);
        this.widthSegments = primitiveData.parts_x;
        this.heigthSegments = primitiveData.parts_y;
    }

    addMaterial(material){
        let object = new THREE.Mesh(this, material);
        return object
    }
}

export { MyRectangle };