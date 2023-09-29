import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import {MyFrame} from './MyFrame.js';

/**
 * This class contains a Candle representation
 */
class MyWindow extends THREE.Object3D {

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

        this.frame = new MyFrame(this.app, this.size, this.lenght, this.hight, this.color, [0,0,0], 0);
        this.add(this.frame);

        //horrizontal
        const geometry = new THREE.BoxGeometry( this.lenght-this.size*2, this.size, this.size);
        let frameBottom = new THREE.Mesh(geometry, materialFrame);
        frameBottom.position.set(0,this.hight/2,0);
        this.add(frameBottom);

        //Vertical
        const hightSides =this.hight - this.size;
        const geometryLeft = new THREE.BoxGeometry(this.size, hightSides,this.size);
        let frameLeft = new THREE.Mesh(geometryLeft, materialFrame);
        frameLeft.position.set(0,hightSides/2+this.size/2,0);
        this.add(frameLeft);

      

        this.position.set(position[0],position[1],position[2]);
        this.rotateY(rotation);
        

        
    }
}
MyWindow.prototype.isGroup = true;
export { MyWindow };