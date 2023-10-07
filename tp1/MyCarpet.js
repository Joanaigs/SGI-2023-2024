import * as THREE from 'three';
import { MyApp } from './MyApp';

/**
 * This class contains a carpet representation
 */
export class MyCarpet extends THREE.Object3D {
    /**
     * 
     * @param {MyApp} app the application object
     * @param {hex} color the color of the carpet
     * @param {list} position the position of the carpet
     */
    constructor(app, color, position) {
        super();
        this.type = 'Group';
        this.app = app;
        this.color = color;
        this.position.set(position[0], position[1], position[2]);

        //carpet
        const geometryCarpet = new THREE.CircleGeometry( 5, 32 );
        const materialCarpet = new THREE.MeshPhongMaterial( { color: this.color } );
        const carpet = new THREE.Mesh( geometryCarpet, materialCarpet );
        carpet.position.set(position[0],position[1]+0.01,position[2]);
        carpet.rotateX(-Math.PI / 2);
        this.add( carpet );
    }
    
}

MyCarpet.prototype.isGroup = true;
