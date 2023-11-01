import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

/**
 * This class contains a Plate representation
 */
class MyPlate extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} size the size overall
     * @param {hex} color the color of the plate
     * @param {list} position the position of the plate
     * @param {bool} castShadow true if the plate casts shadow
     *
     */
    constructor(app, size, color, position, castShadow=false) {
        super();
        this.app = app;
        this.size = size || 2;
        this.color = color

        const material = new THREE.MeshPhongMaterial( {color: color, specular: "#777777", emissive: "#000000", shininess:40} ); 


        //plate base
        const baseHeight = 0.05 * this.size;
        const geometryPlateBase = new THREE.CylinderGeometry( 0.3 * this.size, 0.3 * this.size, baseHeight, 40 ); 
        let plateBase = new THREE.Mesh( geometryPlateBase, material ); 
        if(castShadow){
            plateBase.receiveShadow = true;
            plateBase.castShadow = true;
        }
        plateBase.position.set(position[0],position[1]  +baseHeight / 2,position[2]);
        this.add( plateBase );

        //plate
        const plateHeight = 0.2 * this.size;
        const geometryPlate = new THREE.CylinderGeometry( 1 * this.size, 0.3* this.size, plateHeight, 32 ); 
        let plate = new THREE.Mesh( geometryPlate, material ); 
        if(castShadow){
            plate.receiveShadow = true;
            plate.castShadow = true;
        }
        plate.position.set(position[0],position[1] + baseHeight + plateHeight / 2,position[2]);
        this.add( plate );
        
        this.height=plateHeight+baseHeight;
        
    }

    /**
     * 
     * @returns the height of the plate
     */
    plateHeight(){
        return this.height;
    }
}

MyPlate.prototype.isGroup = true;
export { MyPlate };