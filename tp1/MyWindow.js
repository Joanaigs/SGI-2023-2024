import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { MyFrame } from './MyFrame.js';

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
    constructor(app, size, length, height, color, position, rotation, contentTexturePath, frameTexturePath) {
        super();
        this.type = 'Group';
        this.app = app;
        this.size = size || 2;
        this.color = color;
        this.length = length;
        this.height = height;
        this.window = window;
        this.contentTexturePath = contentTexturePath;
        this.frameTexturePath = frameTexturePath;
        RectAreaLightUniformsLib.init();
        this.frame = new MyFrame(this.app, this.size, this.length, this.height, this.color,position, rotation, this.contentTexturePath, this.frameTexturePath, true);
        this.add(this.frame);

        //spotlight light

        this.rectLight = new THREE.RectAreaLight( 0xffffff, 1, this.length, this.height );
        this.rectLight.position.set( position[0], position[1]+ height/2, position[2] );
        this.rectLight.rotateY(-Math.PI/2)
        this.add( this.rectLight );

        //light helper
        this.rectLightHelper = new RectAreaLightHelper( this.rectLight );
        this.add( this.rectLightHelper );
    }
}
MyWindow.prototype.isGroup = true;
export { MyWindow };
