import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Texture
 */
class MyTexture extends THREE.Texture{


    constructor(textureData) {
        super();
        this.isVideo = textureData.isVideo;
        this.magFilter = textureData.magFilter;
        this.minFilter = textureData.minFilter;
        this.generateMipmaps = textureData.generateMipmaps;
        this.anisotropy = textureData.anisotropy;
    }

    updateTexture(textureData){
        this.isVideo = textureData.isVideo;
        this.magFilter = textureData.magFilter;
        this.minFilter = textureData.minFilter;
        this.generateMipmaps = textureData.generateMipmaps;
        this.anisotropy = textureData.anisotropy;        
        
    }

    setRepeat(x,y){
        this.repeat.set(x,y);
    }
}


export { MyTexture };