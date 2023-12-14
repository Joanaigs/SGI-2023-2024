import * as THREE from 'three';

/**
 * This class creates a Rectangle
 */
class MyRectangle {

    /**
     * The constructor of the rectangle that receives the data from the parser and creates the rectangle
     * @param {Dictionary} primitiveData the data of the primitive
     */
    constructor(primitiveData) {
        this.xy1 = primitiveData.xy1;
        this.xy2 = primitiveData.xy2;
        this.width = primitiveData.xy2[0] - primitiveData.xy1[0];
        this.height = primitiveData.xy2[1] - primitiveData.xy1[1];
        this.widthSegments = primitiveData.parts_x;
        this.heigthSegments = primitiveData.parts_y;
        this.rectangle = new THREE.PlaneGeometry(Math.abs(this.width), Math.abs(this.height), this.widthSegments, this.heigthSegments);
    }

     /**
     * Adds the material to the rectangle and returns the object
     * @param {MyMaterial} material the material of the rectangle
     * @param {boolean} castshadow if the rectangle casts shadow or not
     * @param {boolean} receiveshadows if the rectangle receives shadow or not
     * @returns the object with the material
     */
    addMaterial(material, castshadow, receiveshadows){
        material.setRepeat(this.width, this.height)
        let object = new THREE.Mesh(this.rectangle, material);
        object.position.set(this.xy1[0] + this.width/2, this.xy1[1] + this.height/2, 0);
        if(castshadow){
            object.castShadow = true;
        }
        if(receiveshadows){
            object.receiveShadow = true;
        }
        return object
    }
}

export { MyRectangle };