import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a texture
 */
class MyTexture{


    constructor(app, textureData ) {
        this.app = app;
        this.filepath = textureData.filepath;
        this.isVideo = textureData.isVideo;
        this.magFilter = textureData.magFilter;
        this.minFilter = textureData.minFilter;
        this.generateMipmaps = textureData.generateMipmaps;
        this.anisotropy = textureData.anisotropy;
    }

    updateTexture(textureData){
        this.filepath = textureData.filepath;
        this.isVideo = textureData.isVideo;
        this.magFilter = textureData.magFilter;
        this.minFilter = textureData.minFilter;
        this.generateMipmaps = textureData.generateMipmaps;
        this.anisotropy = textureData.anisotropy;        
        
    }

    getTexture(){
        // Check if it's a video and set it as a video texture if needed
        if (isVideo) {
            const video = document.createElement('video');
            video.src = filepath;
            video.autoplay = true;
            video.loop = true;
            this.texture = new THREE.VideoTexture(video);
            videoTexture.magFilter = magFilter;
            videoTexture.minFilter = minFilter;
            videoTexture.generateMipmaps = generateMipmaps;
            videoTexture.anisotropy = anisotropy;        
        }
        else{
            this.texture = new THREE.TextureLoader().load(textureData.filepath);
            this.texture.magFilter = THREE[magFilter];
            this.texture.minFilter = THREE[minFilter];
            this.texture.generateMipmaps = mipmaps;
            this.texture.anisotropy = textureData.anisotropy;
        }
        return this.texture;
    }
}


export { MyTexture };