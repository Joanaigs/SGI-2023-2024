import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class contains a Candle representation
 */
class MyFrame extends THREE.Object3D {

    /**
     * 
     * @param {MyFrame} app the application object
     * @param {number} size the size of each axis 
     * @param {number} color
     * @param {number} position
     *
     */
    constructor(app, size, lenght, hight , color, position, rotation) {
        super();
        this.type = 'Group';
        this.app = app;
        this.size = size || 2;
        this.color = color
        this.lenght = lenght
        this.hight = hight


        const materialFrame = new THREE.MeshBasicMaterial( {color: color} );
        const materialBack = new THREE.MeshBasicMaterial( {color: 0x000000} );


        //frame top
        const baseHeight = 0.1 * this.size;
        const geometry = new THREE.BoxGeometry( this.lenght, this.size, this.size);
        let frameTop = new THREE.Mesh(geometry, materialFrame);
        frameTop.position.set(0,this.hight,0);
        this.add(frameTop);

        //frame bottom
        let frameBottom = new THREE.Mesh(geometry, materialFrame);
        frameBottom.position.set(0,0,0);
        this.add(frameBottom);

        //frame left
        const hightSides =this.hight - this.size;
        const geometryLeft = new THREE.BoxGeometry(this.size, hightSides,this.size);
        let frameLeft = new THREE.Mesh(geometryLeft, materialFrame);
        frameLeft.position.set(-this.lenght/2+ this.size/2,hightSides/2+this.size/2,0);
        this.add(frameLeft);

        //frame right
        let frameRight = new THREE.Mesh(geometryLeft, materialFrame);
        frameRight.position.set(this.lenght/2- this.size/2,hightSides/2+this.size/2,0);
        this.add(frameRight);

        //back
        const geometryBack = new THREE.PlaneGeometry(this.lenght, hightSides);
        let frameBack = new THREE.Mesh(geometryBack, materialBack);
        frameBack.position.set(0,hightSides/2+this.size/2,this.size/2-0.01);
        frameBack.rotation.y = Math.PI;
        this.add(frameBack);

        this.position.set(position[0],position[1],position[2]);
        this.rotateY(rotation);
        

        
    }
}
MyFrame.prototype.isGroup = true;
export { MyFrame };