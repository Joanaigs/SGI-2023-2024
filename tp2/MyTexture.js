import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Texture
 */
class MyTexture extends THREE.Texture {

    constructor() {
        super(); 
       
    }

    init(textureData) {
        this.textureData = textureData;
        if (this.textureData.magFilter) this.magFilter = this.getMagFilter(this.textureData.magFilter);
        if (this.textureData.minFilter) this.minFilter = this.getMinFilter(this.textureData.minFilter);
        this.generateMipmaps = this.textureData.mipmaps;
        if (this.textureData.anisotropy) this.anisotropy = this.textureData.anisotropy;
        this.updateTexture();
    }

    updateTexture() {
        const loader = new THREE.TextureLoader();
        loader.load(this.textureData.filepath, (texture) => {
            this.image = texture.image;
            if(this.image)
                this.needsUpdate = true;
            this.createMipmaps(this.textureData);
        });
    }


    createMipmaps(data) {
        if (data.mipmap0)
            this.loadMipmap(this, 0, data.mipmap0)
        if (data.mipmap1)
            this.loadMipmap(this, 1, data.mipmap1)
        if (data.mipmap2)
            this.loadMipmap(this, 2, data.mipmap2)
        if (data.mipmap3)
            this.loadMipmap(this, 3, data.mipmap3)
        if (data.mipmap4)
            this.loadMipmap(this, 4, data.mipmap4)
        if (data.mipmap5)
            this.loadMipmap(this, 5, data.mipmap5)
        if (data.mipmap6)
            this.loadMipmap(this, 6, data.mipmap6)
        if (data.mipmap7)
            this.loadMipmap(this, 7, data.mipmap7)
    }

    loadMipmap(parentTexture, level, path) {
        // load texture. On loaded call the function to create the mipmap for the specified level 
        new THREE.TextureLoader().load(path,
            function (mipmapTexture)  // onLoad callback
            {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                ctx.scale(1, 1);

                // const fontSize = 48
                const img = mipmapTexture.image
                canvas.width = img.width;
                canvas.height = img.height

                // first draw the image
                ctx.drawImage(img, 0, 0)

                // set the mipmap image in the parent texture in the appropriate level
                parentTexture.mipmaps[level] = canvas
            },
            undefined, // onProgress callback currently not supported
            function (err) {
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

    cloning(){
        const clonedTexture = this.clone()
        clonedTexture.createMipmaps(this.textureData);
        clonedTexture.textureData = this.textureData;

        return clonedTexture;
    }
}


export { MyTexture };