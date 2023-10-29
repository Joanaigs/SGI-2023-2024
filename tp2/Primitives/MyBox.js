import * as THREE from 'three';

/**
 * This class creates a Box
 */
class MyBox{

    constructor(primitiveData) {
        this.width = Math.abs(primitiveData.xyz1[0] - primitiveData.xyz2[0]);
        this.height = Math.abs(primitiveData.xyz1[1] - primitiveData.xyz2[1]);
        this.depth = Math.abs(primitiveData.xyz1[2] - primitiveData.xyz2[2]);
        this.widthSegments = primitiveData.parts_x;
        this.heigthSegments = primitiveData.parts_y;
        this.depthSegments = primitiveData.parts_z;
        this.box = new THREE.BoxGeometry(this.width, this.height, this.depth, this.widthSegments, this.heigthSegments, this.depthSegments);
    }

    addMaterial(material){
        let object = new THREE.Mesh(this.box, material);
        return object
    }

}

export { MyBox };