import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

/**
 * This class contains a Frame representation
 */
class MyFrame extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} size the width of the frame
     * @param {number} length the length of the frame
     * @param {number} height the height of the frame
     * @param {list} position the position of the frame
     * @param {number} rotation the rotation of the frame
     * @param {THREE.MeshPhongMaterial} contentMaterial content material
     * @param {THREE.MeshPhongMaterial} frameMaterial material of the frames 
     * @param {boolean} window is a window or not
     * @param {boolean} shadows has shadows or not
     */
    constructor(app, size, length, height, position, rotation, contentMaterial, frameMaterial, window = false, shadows = false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.size = size || 2;
        this.length = length;
        this.height = height;
        this.window = window;
        this.contentMaterial = contentMaterial;
        this.frameMaterial = frameMaterial;            
            
        //frame top
        const geometry = new THREE.BoxGeometry( this.length, this.size, this.size);
        let frameTop = new THREE.Mesh(geometry, this.frameMaterial);
        if(shadows){
            frameTop.castShadow = true;
            frameTop.receiveShadow = true;
        }
        frameTop.position.set(0,this.height,0);
        this.add(frameTop);

        //frame bottom
        let frameBottom = new THREE.Mesh(geometry, this.frameMaterial);
        if(shadows){
            frameBottom.castShadow = true;
            frameBottom.receiveShadow = true;
        }
        frameBottom.position.set(0,0,0);
        this.add(frameBottom);

        //frame left
        const heightSides = this.height - this.size;
        const geometryLeft = new THREE.BoxGeometry(this.size, heightSides, this.size);
        let frameLeft = new THREE.Mesh(geometryLeft, this.frameMaterial);
        if(shadows){
            frameLeft.castShadow = true;
            frameLeft.receiveShadow = true;
        }
        frameLeft.position.set(-this.length/2 + this.size/2, heightSides/2 + this.size/2, 0);
        this.add(frameLeft);

        //frame right
        let frameRight = new THREE.Mesh(geometryLeft, this.frameMaterial);
        if(shadows){
            frameRight.castShadow = true;
            frameRight.receiveShadow = true;
        }
        frameRight.position.set(this.length/2 - this.size/2, heightSides/2 + this.size/2, 0);
        this.add(frameRight);

        if(!window){
            // content of the frame (the paiting)
            const geometryBack = new THREE.PlaneGeometry(this.length, heightSides);
            let frameBack = new THREE.Mesh(geometryBack,this.contentMaterial);
            frameBack.rotation.y = Math.PI;
            frameBack.position.set(0, heightSides/2 + this.size/2, this.size/2 - 0.01);
            this.add(frameBack);
        }

        
        this.rotateY(rotation); 
        this.position.set(position[0], position[1], position[2]);
    }
}
MyFrame.prototype.isGroup = true;
export { MyFrame };
