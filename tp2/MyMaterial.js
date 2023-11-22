import * as THREE from 'three';
import { MyApp } from './MyApp.js';

/**
 * This class creates a Material
 */
class MyMaterial extends THREE.MeshPhongMaterial{

    /**
     * Initializes the material and its attributes
     * @param {Dictionary} materialData a dictionary with the material data
     * @param {MyTexture} texture the texture of the material if it has one or null otherwise
     * @param {MyTexture} bumpTexture the bump texture of the material if it has one or null otherwise
     */
    constructor(materialData, texture, bumpTexture=null, specularMap=null ) {
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
        if(specularMap){
            console.log(specularMap)
            specularMap.wrapS = THREE.RepeatWrapping;
            specularMap.wrapT = THREE.RepeatWrapping;
            this.specularMap = specularMap
        }
    }

    /**
     * Set the repeat of the texture and bump texture
     * @param {number} lenght the lenght of the object the material is applied to 
     * @param {number} height the height of the object the material is applied to
     */
    setRepeat(lenght, height){
        if(this.map)
            this.map.repeat.set(lenght/this.texlength_s, height/this.texlength_t)
        if(this.bumpMap)
            this.bumpMap.repeat.set(lenght/this.texlength_s, height/this.texlength_t)
        if(this.specularMap)
            this.specularMap.repeat.set(lenght/this.texlength_s, height/this.texlength_t)
    }

    /**
     * returns a clone of the material
     * @returns {MyMaterial} a clone of the material
     */
    clone(){
        let cloneTex = null;
        let cloneBump = null;
        let cloneSpecular = null;
        if(this.map){
            cloneTex = this.map.cloning();
        }
        if(this.bumpMap){
            cloneBump = this.bumpMap.cloning();
        }
        if(this.specularMap){
            cloneSpecular = this.specularMap.cloning();
        }
        const cloneMaterial= new this.constructor(this.materialData, cloneTex, cloneBump, cloneSpecular)
        return cloneMaterial
    }

}


export { MyMaterial };