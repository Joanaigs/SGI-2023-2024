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
        const materialWick = new THREE.MeshBasicMaterial( {color: 0x000000} );

        // Calculate heights and positions based on size
        const baseHeight = 0.4 * this.size;
        const topHeight = 0.03 * this.size;
        const flameHeight = 0.1 * this.size;

        // Candle base
        const geometryBase = new THREE.CylinderGeometry(0.04 * this.size, 0.05 * this.size, baseHeight, 32, 1);
        let candleBase = new THREE.Mesh(geometryBase, materialCandle);
        candleBase.position.set(position[0], position[1]  + baseHeight / 2, position[2]);
        this.add(candleBase);

        // Candle top
        const geometryTop = new THREE.CylinderGeometry(0.01 * this.size, 0.01 * this.size, topHeight, 32, 1);
        let candleTop = new THREE.Mesh(geometryTop, materialWick);
        candleTop.position.set(position[0], position[1] + baseHeight + topHeight/2 , position[2]);
        this.add(candleTop);

        // Candle flame
        const geometryFlame = new THREE.ConeGeometry(0.03 * this.size, flameHeight);
        let flame = new THREE.Mesh(geometryFlame, materialFlame);
        flame.position.set(position[0], position[1] + baseHeight + topHeight + flameHeight/2, position[2]);
        this.add(flame);




        
    }
}
MyCandle.prototype.isGroup = true;
export { MyCandle };