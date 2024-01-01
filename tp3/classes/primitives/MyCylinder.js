import * as THREE from 'three';

/**
 * This class creates a Cylinder
 */
class MyCylinder{

    /**
     * The constructor of the cylinder that receives the data from the parser and creates the cylinder
     * @param {Dictionary} primitiveData 
     */
    constructor(primitiveData) {
        this.radiusTop = primitiveData.top;
        this.radiusBottom = primitiveData.base;
        this.height = primitiveData.height;
        this.radialSegments = primitiveData.slices;
        this.heightSegments = primitiveData.stacks;
        this.openEnded = primitiveData.capsclose? false : true;
        this.thetaStart = primitiveData.thetastart;
        this.thetaLength = primitiveData.thetalength;
        this.cylinder = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);

    }

    /**
     * Adds the material to the cylinder and returns the object
     * @param {MyMaterial} material the material of the cylinder
     * @param {boolean} castshadow if the cylinder casts shadow or not
     * @param {boolean} receiveshadows if the cylinder receives shadow or not
     * @returns the object with the material
     */
    addMaterial(material, castshadow, receiveshadows){
        let lenght = this.radiusTop>this.radiusBottom? this.radiusTop*2*Math.PI : this.radiusBottom*2*Math.PI
        let size = lenght>this.height? lenght : this.height
        if(material.type !== "ShaderMaterial"){
            material.setRepeat(lenght, size)
        }
        let object = new THREE.Mesh(this.cylinder, material);
        if(castshadow){
            object.castShadow = true;
        }
        if(receiveshadows){
            object.receiveShadow = true;
        }
        return object
    }

}

export { MyCylinder };