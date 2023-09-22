import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Candle representation
 */
class MyCandle extends THREE.Object3D {

    /**
     * 
     * @param {MyCandle} app the application object
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

        const materialCandle = new THREE.MeshBasicMaterial( {color: color} );
        const materialFlame = new THREE.MeshBasicMaterial( {color: 0xff4500} );
        const materialwick = new THREE.MeshBasicMaterial( {color: 0x000000} );

        //candle base
        var geometry = new THREE.CylinderGeometry(0.04* this.size,0.05* this.size,0.4* this.size, 32, 1);
        let candle = new THREE.Mesh( geometry, materialCandle ); 
        candle.position.set(position[0],position[1]+0.2,position[2]);
        this.add( candle );

        //candle top
        var geometry = new THREE.CylinderGeometry(0.01* this.size,0.01* this.size,0.03* this.size, 32, 1);
        let candleTop = new THREE.Mesh( geometry, materialwick );
        candleTop.position.set(position[0],position[1]+0.415,position[2]);
        this.add( candleTop );

        //candle flame
        var geometry = new THREE.ConeGeometry(0.03* this.size, 0.1* this.size);
        let flame = new THREE.Mesh( geometry, materialFlame );
        flame.position.set(position[0],position[1]+0.48,position[2]);
        this.add( flame );




        
    }
}

export { MyCandle };