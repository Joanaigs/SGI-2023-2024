import * as THREE from 'three';

/**
 * This class creates a Sphere
 */
class MySphere extends THREE.SphereGeometry{

    constructor(primitiveData) {
        super();
        this.radius = primitiveData.radius;
        this.widthSegments = primitiveData.slices;
        this.heightSegments = primitiveData.stacks;
        this.phiStart  = primitiveData.phistart;
        this.phiLengtg = primitiveData.philength;
        this.thetaStart  = primitiveData.thetastart;
        this.thetaLength = primitiveData.thetalength;

    }

    addMaterial(material){
        let object = new THREE.Mesh(this, material);
        return object
    }

}

export { MySphere };







this.descriptors["sphere"] = [
    {name: "radius", type: "float"},
    {name: "slices", type: "integer"},
    {name: "stacks", type: "integer"},
    {name: "thetastart", type: "float", required: false, default: 0.0},
    {name: "thetalength", type: "float", required: false, default: 2 * Math.PI},
    {name: "phistart", type: "float", required: false, default: 0.0},
    {name: "philength", type: "float", required: false, default: 2 * Math.PI},
    {name: "distance", type: "float", required: false, default: 0.0}, // The distance at which to display this level of detail. Default 0.0.  
]