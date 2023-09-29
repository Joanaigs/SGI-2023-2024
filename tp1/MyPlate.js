import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Floor representation
 */
class MyPlate extends THREE.Object3D {

    /**
     * 
     * @param {MyPlate} app the application object
     * @param {number} size the size of each axis 
     * @param {number} color
     * @param {number} position
     *
     */
    constructor(app, size, color, position) {
        super();
        this.app = app;
        this.size = size || 2;
        this.color = color
        

        const material = new THREE.MeshBasicMaterial( {color: color} ); 


        //plate base
        const baseHeight = 0.05 * this.size;
        const geometryPlateBase = new THREE.CylinderGeometry( 0.3 * this.size, 0.3 * this.size, baseHeight, 32 ); 
        let plateBase = new THREE.Mesh( geometryPlateBase, material ); 
        plateBase.position.set(position[0],position[1]  +baseHeight / 2,position[2]);
        this.add( plateBase );

        //plate
        const plateHeight = 0.2 * this.size;
        const geometryPlate = new THREE.CylinderGeometry( 1 * this.size, 0.3* this.size, plateHeight, 32 ); 
        let plate = new THREE.Mesh( geometryPlate, material ); 
        plate.position.set(position[0],position[1] + baseHeight + plateHeight / 2,position[2]);
        this.add( plate );
        

        this.height=plateHeight+baseHeight;

        
    }

    plateHeight(){
        return this.height;
    }
}

MyPlate.prototype.isGroup = true;
export { MyPlate };