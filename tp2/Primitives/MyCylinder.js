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
        if(primitiveData.thetaStart)
            this.thetaStart  = primitiveData.thetastart * Math.PI / 180;
        if(primitiveData.thetaLength)
            this.thetaLength = primitiveData.thetalength * Math.PI / 180;
        this.cylinder = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, this.radialSegments, this.heightSegments, this.openEnded, this.thetaStart, this.thetaLength);

    }

    addMaterial(material){
        let object = new THREE.Mesh(this.cylinder, material);
        return object
    }

}

export { MyCylinder };