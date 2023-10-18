import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

/**
 * This class contains a Door representation
 */
class MyDoor extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} width the width of the door
     * @param {number} lenght the lenght of the door
     * @param {number} height the height of the door
     * @param {hex} color the color of the door
     * @param {string} knobTexturePath the path of the knob texture
     * @param {list} position the position of the door
     */
    constructor(app, width, lenght, height , materialDoor, materialKnob, position) {
        super();
        this.type = 'Group';
        this.app = app;
        this.width = width;
        this.lenght = lenght;
        this.height = height;
        this.materialDoor = materialDoor;
        this.materialKnob = materialKnob;
        this.position.set(position[0], position[1], position[2]);
        
        // door plank
        const geometry = new THREE.BoxGeometry( this.lenght, this.height, this.width);
        let door = new THREE.Mesh(geometry, materialDoor);
        door.rotateZ(-Math.PI/2);
        door.position.set(position[0],position[1] + this.width + 1 ,position[2]);
        this.add(door);   
        
        // knob
        const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.2, 0.5, 32); // Adjust size and segments
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, materialKnob);
        cylinderMesh.rotateZ(Math.PI/2);
        cylinderMesh.position.set(position[0] - 0.5, position[1] + this.lenght/2, position[2] - this.width/2 + this.width/7);
        this.add(cylinderMesh);
    }
}
MyDoor.prototype.isGroup = true;
export { MyDoor };