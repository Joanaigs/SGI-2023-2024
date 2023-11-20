import * as THREE from 'three';

/**
 * This class creates a Box
 */
class MyBox{

    constructor(contents, primitiveData) {
        this.contents = contents;
        this.xyz1= primitiveData.xyz1;
        this.xyz2 = primitiveData.xyz2;
        this.width = primitiveData.xyz2[0] - primitiveData.xyz1[0];
        this.height =primitiveData.xyz2[1] - primitiveData.xyz1[1];
        this.depth = primitiveData.xyz2[2] - primitiveData.xyz1[2];
        this.widthSegments = primitiveData.parts_x;
        this.heigthSegments = primitiveData.parts_y;
        this.depthSegments = primitiveData.parts_z;
        this.box = new THREE.BoxGeometry(Math.abs(this.width), Math.abs(this.height), Math.abs(this.depth), this.widthSegments, this.heigthSegments, this.depthSegments);
    }

    addMaterial(material, castshadow, receiveshadows){
        let materialLeft = material.clone();
        let materialRight = material.clone();
        let materialTop = material.clone();
        let materialBottom = material.clone();
        let materialFront = material.clone();
        let materialBack = material.clone();

        materialLeft.setRepeat(this.depth, this.height);
        materialRight.setRepeat(this.depth, this.height);
        materialTop.setRepeat(this.width, this.depth);
        materialBottom.setRepeat(this.width, this.depth);
        materialFront.setRepeat(this.width, this.height);
        materialBack.setRepeat(this.width, this.height);

        this.contents.materialsObjects.push(materialLeft);
        this.contents.materialsObjects.push(materialRight);
        this.contents.materialsObjects.push(materialTop);
        this.contents.materialsObjects.push(materialBottom);
        this.contents.materialsObjects.push(materialFront);
        this.contents.materialsObjects.push(materialBack);

        const boxMaterials = [
            materialLeft,
            materialRight,
            materialTop,
            materialBottom,
            materialFront,
            materialBack
        ];
        let object = new THREE.Mesh(this.box, boxMaterials);
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