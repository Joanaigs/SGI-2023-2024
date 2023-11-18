import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Material
 */
class MyMaterial extends THREE.MeshPhongMaterial{

    constructor(materialData, texture, bumpTexture=null ) {
        super();
        this.materialData=materialData
        this.color = new THREE.Color(materialData.color)
        this.specular = new THREE.Color(materialData.specular);
        this.shininess = materialData.shininess;
        this.emissive  =new THREE.Color( materialData.emissive);
        this.wireframe = materialData.wireframe;
        this.texlength_s = materialData.texlength_s;
        this.texlength_t = materialData.texlength_t;
        this.opacity= materialData.color.a;
        if(this.opacity<1){
            this.transparent=true;
        }
        this.side = (materialData.twosided)? THREE.DoubleSide: THREE.FrontSide;
        this.flatShading = (materialData.shading == "flat")? true : false;
        this.texture=texture;
        this.bumpTexture=bumpTexture;
        if(bumpTexture){
            bumpTexture.wrapS = THREE.RepeatWrapping;
            bumpTexture.wrapT = THREE.RepeatWrapping;
            this.bumpMap= bumpTexture;
            this.bumpScale= materialData.bumpscale;
        }
        if(texture){
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            this.map = texture
        }
    }

    setRepeat(lenght, height){
        if(this.map)
            this.map.repeat.set(lenght/this.texlength_s, height/this.texlength_t)
        if(this.bumpMap)
            this.bumpMap.repeat.set(lenght/this.texlength_s, height/this.texlength_t)
    }

    clone(){
        let cloneTex = null;
        let cloneBump = null;
        if(this.map){
            cloneTex = this.map.cloning();
            cloneTex.needsUpdate=true
        }
        if(this.bumpMap){
            cloneBump = this.bumpMap.cloning();
            cloneBump.needsUpdate=true;
        }
        const cloneMaterial= new this.constructor(this.materialData, cloneTex, cloneBump)
        return cloneMaterial
    }

}


export { MyMaterial };