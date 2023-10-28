import * as THREE from 'three';

/**
 * This class creates a Cylinder
 */
class MyCylinder extends THREE.CylinderGeometry{

    constructor(primitiveData) {
        super();
        this.radiusTop = primitiveData.top;
        this.radiusBottom = primitiveData.base;
        this.height = primitiveData.height;
        this.radialSegments = primitiveData.slices;
        this.heightSegments = primitiveData.stacks;
        this.openEnded = primitiveData.capsclose;
        this.thetaStart  = primitiveData.thetastart;
        this.thetaLength = primitiveData.thetalength;

    }

    addMaterial(material){
        let object = new THREE.Mesh(this, material);
        return object
    }

}

export { MyCylinder };