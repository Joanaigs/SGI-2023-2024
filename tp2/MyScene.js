import * as THREE from 'three';

class MyScene{
    constructor(app){
        this.app = app;
        this.textures = new Map();
        this.materials = new Map();
        this.ligts = new Map();
        this.objects = new Map();
    }

    addTexture(id, texture){
        this.textures.set(id, texture);
    }

    getTexture(id){
        return this.textures.get(id);
    }

    addMaterial(id, material){
        this.materials.set(id, material);
    }

    getMaterial(id){
        return this.materials.get(id);
    }
    
}
export { MyScene };