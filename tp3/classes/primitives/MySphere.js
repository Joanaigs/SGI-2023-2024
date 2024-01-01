import * as THREE from 'three';

/**
 * This class creates a Sphere
 */
class MySphere{
    /**
     * Constructor of the sphere that receives the data from the parser and creates the sphere
     * @param {Dictionary} primitiveData the data of the primitive
     */
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

     /**
     * Adds the material to the sphere and returns the object
     * @param {MyMaterial} material the material of the sphere
     * @param {boolean} castshadow if the sphere casts shadow or not
     * @param {boolean} receiveshadows if the sphere receives shadow or not
     * @returns the object with the material
     */
    addMaterial(material, castshadow, receiveshadows){
        if(material.type !== "ShaderMaterial")
            material.setRepeat(this.radius*2*Math.PI, this.radius*2*Math.PI)
        let object = new THREE.Mesh(this.sphere, material);
        if(castshadow){
            object.castShadow = true;
        }
        if(receiveshadows){
            object.receiveShadow = true;
        }
        return object
    }

}

export { MySphere };
