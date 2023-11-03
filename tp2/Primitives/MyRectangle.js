import * as THREE from 'three';

/**
 * This class creates a Rectangle
 */
class MyRectangle{

    constructor(primitiveData) {
        this.xy1= primitiveData.xy1;
        this.xy2 = primitiveData.xy2;
        this.width = Math.abs(primitiveData.xy1[0] - primitiveData.xy2[0]);
        this.height = Math.abs(primitiveData.xy1[1] - primitiveData.xy2[1]);
        this.widthSegments = primitiveData.parts_x;
        this.heigthSegments = primitiveData.parts_y;
        this.rectangle = new THREE.PlaneGeometry(this.width, this.height, this.widthSegments, this.heigthSegments);
    }

    addMaterial(material, castshadow, receiveshadows){
        let object = new THREE.Mesh(this.rectangle, material);
        object.position.set(this.xy1[0] + this.width/2, this.xy1[1] + this.height/2, 0);
        if(castshadow){
            object.castShadow = true;
        }
        console.log("f")
        if(receiveshadows){
            console.log("receiveshadows")
            object.receiveShadow = true;
        }
        return object
    }
}

export { MyRectangle };