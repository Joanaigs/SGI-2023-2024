import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Candle representation
 */
class MySofaOne extends THREE.Object3D {

    /**
     * 
     * @param {MySofa} app the application object
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

        const materialSofa = new THREE.MeshBasicMaterial( {color: color} );

        // Calculate heights and positions based on size
        const baseHeight = 1.5 * this.size;
        const sofaWidth = 3 * this.size;
        const sofaLength = 1.5 * this.size;
        const backWidth = 3 * this.size;
        const backHeight = 3 * this.size;
        const flameHeight = 0.1 * this.size;

        //Sofa base
        const geometryBase = new THREE.BoxGeometry( 3, baseHeight, sofaWidth);
        let sofaBase = new THREE.Mesh(geometryBase, materialSofa);
        sofaBase.position.set(position[0], position[1]  + baseHeight / 2, position[2]);
        this.add(sofaBase);

        //Sofa back
        const geometryBack = new THREE.BoxGeometry( backWidth, backHeight, sofaWidth/3);
        let sofaBack = new THREE.Mesh(geometryBack, materialSofa);
        sofaBack.position.set(position[0], position[1]  + baseHeight + backHeight/2 , position[2]+sofaWidth/2-backWidth/2);
        this.add(sofaBack);



        
    }
}

export { MySofaOne };