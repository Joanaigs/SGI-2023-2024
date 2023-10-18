import * as THREE from 'three';

/**
 * This class contains a Coil representation
 */
class MyCoil extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} radius the radius of the coil
     * @param {number} numCoils number of coils
     * @param {number} seperation distance between coils 
     * @param {list} position position of the coil
     * @param {number} rotation angle of rotation of the coil in y axis
     * @param {boolean} shadow if the object has shadow or not
     */
    constructor(app, radius, numCoils, seperation, position, rotation, shadow=false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.radius = radius;
        this.numCoils = numCoils;
        this.seperation = seperation;
        this.shadow = shadow;
        this.buidCoil();
        this.rotateY(rotation);
        this.position.set(position[0],position[1],position[2]+seperation);

    }

    /**
     * Created the coil
     */
    buidCoil(){
        const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    
        const halfCircle = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-this.radius, 0, 0),        // Start point
            new THREE.Vector3(-this.radius, this.radius * 1.4, 0),        // Control point 1
            new THREE.Vector3(this.radius, this.radius * 1.4, 0),        // Control point 2
            new THREE.Vector3(this.radius, 0, this.seperation)         // End point
        );
    
        const tubeSegments = 20; // Number of segments
        const geometryHalfCircle = new THREE.TubeGeometry(halfCircle, tubeSegments, 0.03, 8, false);
    
        let previous = 0;
    
        for (let i = 0; i < this.numCoils * 2; i++) {
            let rotationX = (i % 2 === 0) ? Math.PI : 0; // Alternate rotation between 0 and π
            const halfCircleObject1 = new THREE.Mesh(geometryHalfCircle, material);
            if(this.shadow){
                halfCircleObject1.castShadow = true;
                halfCircleObject1.receiveShadow = true;
            }
            let offset = (i % 2 === 0) ? 0 : this.seperation * 2; 
            halfCircleObject1.rotation.x = rotationX;
            halfCircleObject1.position.set(0, 0, previous);
            this.add(halfCircleObject1);
            previous += offset;
        }
    }


}
MyCoil.prototype.isGroup = true;
export { MyCoil };
