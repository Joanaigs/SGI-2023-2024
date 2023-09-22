import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyPlate } from './MyPlate.js';
import { MyCandle } from './MyCandle.js';

/**
 * This class contains a Floor representation
 */
class MyCake extends THREE.Object3D {

    /**
     * 
     * @param {MyCake} app the application object
     * @param {number} size the size of each axis 
     * @param {number} color
     * @param {number} position
     *
     */
    constructor(app, color) {
        super();
        this.type = 'Group';
        this.app = app;
        this.color = color

        this.plate = new MyPlate(this, 1, 0xf5e9dc, [0,-0.3,0]);
        this.add(this.plate);

        const material = new THREE.MeshBasicMaterial( {color: color} ); 

        //cake
        var geometry = new THREE.CylinderGeometry(0.8 ,0.8,0.6, 32, 1, false, 0, (5*Math.PI)/3);
        let cake = new THREE.Mesh( geometry, material ); 
        this.add( cake );

        //candle
        this.candle = new MyCandle(this, 1, 0xffffff, [0,0.3,0]);
        this.add(this.candle);

        
    }

}
MyCake.prototype.isGroup = true;
export { MyCake };