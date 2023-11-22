import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Video Texture
 */
class MyVideoTexture extends THREE.VideoTexture {

    /**
     * Constructor of the Video Texture that calls the constructor of the super class amd sets the video element
     * @param {*} textureData 
     */
    constructor(textureData) {
        let videoElement = document.getElementById("video")
        videoElement.src = textureData.filepath;
        videoElement.crossOrigin = "anonymous";
        super(videoElement)
       
        this.textureData = textureData;

    }

    /**
     * Returns the mag filter of the texture
     * @param {string} string nearest or linear
     * @returns the Three obejct type of the mag filter
     */
    getMagFilter(string) {
        switch (string) {
            case "NearestFilter":
                return THREE.NearestFilter;
            case "LinearFilter":
                return THREE.LinearFilter;
        }
    }

    /**
     * Returns the min filter of the texture
     * @param {string} string of the min filter
     * @returns the Three obejct type of the min filter
     */
    getMinFilter(string) {
        switch (string) {
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

    /**
     * 
     * @returns {MyVideoTexture} a clone of the texture
     */
    cloning(){
        return new this.constructor(this.textureData);
    }

}


export { MyVideoTexture };