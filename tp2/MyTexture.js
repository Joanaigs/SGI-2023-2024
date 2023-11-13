import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Texture
 */
class MyTexture {


    constructor(textureData) {
        this.texture = null;
        this.textureData = textureData;
        this.isVideo = textureData.isVideo;
        if (!this.isVideo) {
            this.texture = new THREE.TextureLoader().load(textureData.filepath)
            if (textureData.magFilter)
                this.texture.magFilter = this.getMagFilter(textureData.magFilter);
            if (textureData.minFilter)
                this.texture.minFilter = this.getMinFilter(textureData.minFilter);
            this.texture.generateMipmaps = textureData.mipmaps;
            if (textureData.anisotropy)
                this.texture.anisotropy = textureData.anisotropy;
            this.mipmaps()
        }
        else {
            const videoElement = document.getElementById("video")
            videoElement.src = textureData.filepath;
            videoElement.crossOrigin = "anonymous";
            this.texture = new THREE.VideoTexture(videoElement);
        }
    }

    mipmaps() {
        if(this.textureData.mipmap0)
            this.loadMipmap(this.texture, 0, this.textureData.mipmap0)
        if(this.textureData.mipmap1)
            this.loadMipmap(this.texture, 1, this.textureData.mipmap1)
        if(this.textureData.mipmap2)
            this.loadMipmap(this.texture, 2, this.textureData.mipmap2)
        if(this.textureData.mipmap3)
            this.loadMipmap(this.texture, 3, this.textureData.mipmap3)
        if(this.textureData.mipmap4)
            this.loadMipmap(this.texture, 4, this.textureData.mipmap4)
        if(this.textureData.mipmap5)
            this.loadMipmap(this.texture, 5, this.textureData.mipmap5)
        if(this.textureData.mipmap6)
            this.loadMipmap(this.texture, 6, this.textureData.mipmap6)
        if(this.textureData.mipmap7)
            this.loadMipmap(this.texture, 7, this.textureData.mipmap7)
    }

    loadMipmap(parentTexture, level, path)
    {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path, 
            function(mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);
                
                // const fontSize = 48
                const img = mipmapTexture.image         
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0 )
                             
                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function(err) {
                console.error('Unable to load the image ' + path + ' as mipmap level ' + level + ".", err)
            }
        )
    }

    getMagFilter(string) {
        switch (string) {
            case "NearestFilter":
                return THREE.NearestFilter;
            case "LinearFilter":
                return THREE.LinearFilter;
        }
    }

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
    getTexture() {
        return this.texture;
    }


    setRepeat(x, y) {
        this.repeat.set(x, y);
    }

    update() {
        this.texture.update();
    }
}


export { MyTexture };