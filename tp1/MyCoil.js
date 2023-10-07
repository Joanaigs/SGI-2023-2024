import * as THREE from 'three';
import { MyFrame } from './MyFrame.js';

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
     */
    constructor(app, radius, numCoils, seperation, position, rotation) {
        super();
        this.type = 'Group';
        this.app = app;
        this.radius = radius;
        this.numCoils = numCoils;
        this.seperation = seperation;
        this.buidCoil();
        this.position.set(position[0],position[1],position[2]+seperation);
        this.rotateY(rotation);

    }

    /**
     * Created the coil
     */
    buidCoil(){
        const material = new THREE.LineBasicMaterial({ color: 0xff0000});

        const halfCircle = new THREE.CubicBezierCurve3(
            new THREE.Vector3(-this.radius, 0, 0),        // Start point
            new THREE.Vector3(-this.radius, this.radius*1.4, 0),        // Control point 1
            new THREE.Vector3(this.radius, this.radius*1.4, 0),        // Control point 2
            new THREE.Vector3(this.radius, 0, this.seperation)         // End point
        );
        const pointsHalfCircle = halfCircle.getPoints(20);
        const geometryhalfCircle = new THREE.BufferGeometry().setFromPoints(pointsHalfCircle);
        let previous = 0;

        for (let i = 0; i < this.numCoils*2; i++) {
            let rotationX = (i % 2 === 0) ? Math.PI : 0; // Alternate rotation between 0 and π
            const halfCircleObject1 = new THREE.Line(geometryhalfCircle, material);
            let offset = (i % 2 === 0) ? 0 : this.seperation*2; // Alternate rotation between 0 and π
            halfCircleObject1.position.set(0, 0, previous);
            halfCircleObject1.rotation.x = rotationX;
            this.add(halfCircleObject1);
            previous += offset;

        }
    }


}
MyCoil.prototype.isGroup = true;
export { MyCoil };
