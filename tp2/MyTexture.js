import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Texture
 */
class MyTexture{


    constructor(textureData) {
        this.texture = new THREE.TextureLoader().load(textureData.filepath)
        console.log(textureData)
        if(textureData.magFilter)
            this.texture.magFilter = this.getMagFilter(textureData.magFilter);
        if(textureData.minFilter)
            this.texture.minFilter = this.getMinFilter(textureData.minFilter);
        if(textureData.generateMipmaps)
            this.texture.generateMipmaps = textureData.generateMipmaps;
        if(textureData.anisotropy)
            this.texture.anisotropy = textureData.anisotropy;
        this.isVideo = textureData.isVideo;
    }

    getMagFilter(string){
        switch(string){
            case "NearestFilter":
                return THREE.NearestFilter;
            case "LinearFilter":
                return THREE.LinearFilter;
        }
    }

    getMinFilter(string){
        switch(string){
            case "NearestFilter":
                return THREE.NearestFilter;
            case "NearestMipMapNearestFilter":
                return THREE.NearestMipMapNearestFilter;
            case "NearestMipmapNearestFilter":
                return THREE.NearestMipmapNearestFilter;
            case "NearestMipmapLinearFilter":
                return THREE.NearestMipmapLinearFilter;
            case "NearestMipMapLinearFilter":
                return THREE.NearestMipMapLinearFilter;
            case "LinearFilter":
                return THREE.LinearFilter;
            case "LinearMipMapNearestFilter":
                return THREE.LinearMipMapNearestFilter;
            case "LinearMipmapNearestFilter":
                return THREE.LinearMipmapNearestFilter;
            case "LinearMipmapLinearFilter":
                return THREE.LinearMipmapLinearFilter;
            case "LinearMipMapLinearFilter":
                return THREE.LinearMipMapLinearFilter;
        }
    }
    getTexture(){
        return this.texture;
    }


    setRepeat(x,y){
        this.repeat.set(x,y);
    }
}


export { MyTexture };