import * as THREE from 'three';

/**
 * This class creates a Cylinder
 */
class MyCylinder{

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

    addMaterial(material, castshadow, receiveshadows){
        let lenght = this.radiusTop>this.radiusBottom? this.radiusTop*2*Math.PI : this.radiusBottom*2*Math.PI
        let size = lenght>this.height? lenght : this.height
        material.setRepeat(lenght, size)
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