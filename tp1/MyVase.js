import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Floor representation
 */
class MyVase extends THREE.Object3D {

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


        //vase base
        const baseHeight = 1 * this.size;
        const geometryVaseBase = new THREE.CylinderGeometry( 1*this.size, this.size*0.5, baseHeight, 32 );

        let base = new THREE.Mesh( geometryVaseBase, material ); 
        base.position.set(position[0],position[1] + baseHeight/2,position[2]);
        this.add( base );

        //vase middle

        const middleHeight = 1.5 * this.size;
        const geometryVaseMiddle = new THREE.CylinderGeometry( this.size*0.5, this.size*1, middleHeight, 32 );
        let middle = new THREE.Mesh( geometryVaseMiddle, material );
        middle.position.set(position[0],position[1]  + baseHeight + middleHeight/2,position[2]);
        this.add( middle );

        //vase top
        const topHeight = 0.5 * this.size;
        const geometryVaseTop = new THREE.CylinderGeometry( 0.7*this.size, this.size * 0.5, topHeight, 32); 
        let top = new THREE.Mesh( geometryVaseTop, material ); 
        top.position.set(position[0],position[1]  + baseHeight + middleHeight + topHeight/2,position[2]);
        this.add( top );
        
    }

}

export { MyVase };