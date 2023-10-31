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
        this.openEnded = primitiveData.capsclose;
        this.thetaStart = primitiveData.thetastart;
        this.thetaLength = primitiveData.thetalength;
        this.cylinder = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);

    }

    addMaterial(material){
        let object = new THREE.Mesh(this.cylinder, material);
        return object
    }

}

export { MyCylinder };