import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Cabinet representation
 */
class MyCabinet extends THREE.Object3D {

    /**
     * 
     *
     */
    constructor(app, length, width, colorBase,  position) {
        super();
        this.app = app;
        this.length = length;
        this.width = width;
        this.colorBase = colorBase;

        const material = new THREE.MeshBasicMaterial( {color: colorBase} );

        //Sofa base
        const geometryBase = new THREE.BoxGeometry( sofaLength, baseHeight, sofaWidth);
        let sofaBase = new THREE.Mesh(geometryBase, materialSofa);
        sofaBase.position.set(position[0], position[1]  + baseHeight / 2, position[2]);
        this.add(sofaBase);
        
    }
}
MySofa.prototype.isGroup = true;
export { MySofa };