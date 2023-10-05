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
    constructor(app, size, length, height, color, position, rotation, contentTexturePath, frameTexturePath, window = false) {
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


        this.frameTexture =new THREE.TextureLoader().load(frameTexturePath);
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 100;
        this.frameMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.frameTexture });
        
            
        this.contentTexture =new THREE.TextureLoader().load(contentTexturePath);
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#000000";
        this.planeShininess = 100;
        this.contentMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: 100, map: this.contentTexture });

        //frame top
        const baseHeight = 0.1 * this.size;
        const geometry = new THREE.BoxGeometry( this.length, this.size, this.size);
        let frameTop = new THREE.Mesh(geometry, this.frameMaterial);
        frameTop.position.set(0,this.height,0);
        this.add(frameTop);

        //frame bottom
        let frameBottom = new THREE.Mesh(geometry, this.frameMaterial);
        frameBottom.position.set(0,0,0);
        this.add(frameBottom);

        //frame left
        const heightSides = this.height - this.size;
        const geometryLeft = new THREE.BoxGeometry(this.size, heightSides, this.size);
        let frameLeft = new THREE.Mesh(geometryLeft, this.frameMaterial);
        frameLeft.position.set(-this.length/2 + this.size/2, heightSides/2 + this.size/2, 0);
        this.add(frameLeft);

        //frame right
        let frameRight = new THREE.Mesh(geometryLeft, this.frameMaterial);
        frameRight.position.set(this.length/2 - this.size/2, heightSides/2 + this.size/2, 0);
        this.add(frameRight);

        //back
        const geometryBack = new THREE.PlaneGeometry(this.length, heightSides);
        let frameBack = new THREE.Mesh(geometryBack,this.contentMaterial);
        frameBack.position.set(0, heightSides/2 + this.size/2, this.size/2 - 0.01);
        frameBack.rotation.y = Math.PI;
        this.add(frameBack);

        this.position.set(position[0], position[1], position[2]);
        this.rotateY(rotation); 
    }
}
MyFrame.prototype.isGroup = true;
export { MyFrame };
