import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a texture
 */
class MyTexture extends THREE.Texture{


    constructor(textureData ) {
        super();
        this.image = textureData.filepath;
        this.isVideo = textureData.isVideo;
        this.magFilter = textureData.magFilter;
        this.minFilter = textureData.minFilter;
        this.generateMipmaps = textureData.generateMipmaps;
        this.anisotropy = textureData.anisotropy;
    }

    updateTexture(textureData){
        this.image = textureData.filepath;
        this.isVideo = textureData.isVideo;
        this.magFilter = textureData.magFilter;
        this.minFilter = textureData.minFilter;
        this.generateMipmaps = textureData.generateMipmaps;
        this.anisotropy = textureData.anisotropy;        
        
    }
}


export { MyTexture };