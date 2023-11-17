import * as THREE from 'three';

/**
 * This class creates a Box
 */
class MyBox{

    constructor(primitiveData) {
        this.xyz1= primitiveData.xyz1;
        this.xyz2 = primitiveData.xyz2;
        this.width = Math.abs(primitiveData.xyz1[0] - primitiveData.xyz2[0]);
        this.height = Math.abs(primitiveData.xyz1[1] - primitiveData.xyz2[1]);
        this.depth = Math.abs(primitiveData.xyz1[2] - primitiveData.xyz2[2]);
        this.widthSegments = primitiveData.parts_x;
        this.heigthSegments = primitiveData.parts_y;
        this.depthSegments = primitiveData.parts_z;
        this.box = new THREE.BoxGeometry(this.width, this.height, this.depth, this.widthSegments, this.heigthSegments, this.depthSegments);
    }

    addMaterial(material, castshadow, receiveshadows){
        let size = this.width>this.height? this.width : this.height
        material.setRepeat(size, this.height)
        let object = new THREE.Mesh(this.box, material);
        object.position.set(this.xyz1[0] + this.width/2, this.xyz1[1] + this.height/2, this.xyz1[2] + this.depth/2);
        if(castshadow){
            object.castShadow = true;
        }
        if(receiveshadows){
            object.receiveShadow = true;
        }
        return object
    }

}

export { MyBox };