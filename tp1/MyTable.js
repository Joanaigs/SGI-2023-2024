import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a 3D axis representation
 */
class MyTable extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} size the size of each axis 
     * @param {number} baseRadius the base radius of each axis
     * @param {number} xxColor the hexadecimal representation of the xx axis color
     * @param {number} yyColor the hexadecimal representation of the xx axis color
     * @param {number} zzColor the hexadecimal representation of the zz axis color
     */
    constructor(size, baseRadius, xxColor, yyColor, zzColor) {
        super();
        /*this.type = 'Group';
        this.size = size || 2;
        this.baseRadius = baseRadius || 0.05;
        this.xxColor = xxColor || 0xff0000
        this.yyColor = yyColor || 0x00ff00
        this.zzColor = zzColor || 0x0000ff

        // leg 1
        const leg1 = new THREE.BoxGeometry( this.baseRadius, this.size, 32 ); 
        const leg1Material = new THREE.MeshBasicMaterial( {color: this.yyColor} );
        const leg1Mesh = new THREE.Mesh(leg1, leg1Material ); 
        leg1Mesh.position.set(0,0,0);
        this.add( leg1Mesh );*/
    
    }
}

MyTable.prototype.isGroup = true;

export { MyTable };