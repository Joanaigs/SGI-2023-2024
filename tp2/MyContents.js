import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyTexture } from './MyTexture.js';
import { MyVideoTexture } from './MyVideoTexture.js';

import { MyMaterial } from './MyMaterial.js';
import { MyLights } from './MyLights.js';
import { MyNodeParser } from './MyNodeParser.js';
/**
 *  This class contains the contents of out application
 */
class MyContents  {

    /**
       constructs the object
       @param {MyApp} app The application object
    */ 
    constructor(app) {
        this.app = app
        this.axis = null
        this.myLights = new MyLights(this)
        this.textures = new Map();
        this.materials = new Map();
        this.materialsObjects = []
        this.primitivesObjects = new Map();	
        this.nodeObjects = new Map();
        this.lights = new Map();
        this.lightsHelper = new Map();
        this.lightEnabled = {};
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/scene/scene.xml");	
        this.wireframe = false;
    }

    /**
     * initializes the contents
     */
    init() {
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this)
            this.app.scene.add(this.axis)
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.")
        this.onAfterSceneLoadedAndBeforeRender(data);
    }

    output(obj, indent = 0) {
        //console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {

        this.app.scene.updateGlobals(data.options, data.fog, data.skyboxes);

        this.app.initCameras(data.cameras, data.activeCameraId)

        for (var key in data.textures) {
            let myTexture = null;
            let texture = data.textures[key]
            console.log(texture)
            if(texture.isVideo){
                console.log(texture)
                myTexture = new MyVideoTexture(texture);
            }
            else {
                myTexture = new MyTexture(texture);
            }
            this.textures.set(texture.id, myTexture);
        }


        for (var key in data.materials) {
            let material = data.materials[key];
            let texture = this.getTexture(material.textureref);
            let bumpTexture =null
            if(material.bumpref!==null){
                bumpTexture = this.getTexture(material.bumpref);
            }
            this.materials.set(material.id, new MyMaterial(material, texture, bumpTexture));
        }

        this.nodeParser= new MyNodeParser(this, data);
        this.nodeParser.init();

    }

    getTexture(id){
        return this.textures.get(id);
    }


    updateLights(id){
        let light = this.lights.get(id);
        if (light) {
            light.visible = this.lightEnabled[id];
        } 
    }

    updateWireframe(){
        for( let material of this.materialsObjects){
            material.wireframe = this.wireframe;
        }
    }

    update() {
        
    }
}

export { MyContents };