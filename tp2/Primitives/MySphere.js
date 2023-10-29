import * as THREE from 'three';

/**
 * This class creates a Sphere
 */
class MySphere{

    constructor(primitiveData) {
        this.radius = primitiveData.radius;
        this.widthSegments = primitiveData.slices;
        this.heightSegments = primitiveData.stacks;
        this.phiStart  = primitiveData.phistart;
        this.phiLengtg = primitiveData.philength;
        this.thetaStart  = primitiveData.thetastart;
        this.thetaLength = primitiveData.thetalength;
        this.sphere = new THREE.SphereGeometry(this.radius, this.widthSegments, this.heightSegments, this.phiStart, this.phiLengtg, this.thetaStart, this.thetaLength);
    }

    addMaterial(material){
        let object = new THREE.Mesh(this.sphere, material);
        return object
    }

}

export { MySphere };
