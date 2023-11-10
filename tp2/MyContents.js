import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyTexture } from './MyTexture.js';
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


        this.addLights();
        console.log(this.app.scene)
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
            let texture = data.textures[key]
            let myTexture = new MyTexture(texture);
            this.textures.set(texture.id, myTexture.getTexture());        
        }

        for (var key in data.materials) {
            let material = data.materials[key];
            let texture = this.getTexture(material.textureref);
            this.materials.set(material.id, new MyMaterial(material, texture));
        }

        this.nodeParser= new MyNodeParser(this, data);
        this.nodeParser.init();

    }

    getTexture(id){
        return this.textures.get(id);
    }

    addLights(){
        for (let [id, light] of this.lights) {
            if(this.lightEnabled[id]){
                this.app.scene.add(light);
            }
        }

    }

    updateLights(id){
        if(this.lightEnabled[id]){
            this.app.scene.add(this.lights.get(id));
        }else{
            this.app.scene.remove(this.lights.get(id));
        }
    }

    updateWireframe(){
        for(let [id, material] of this.materials){
            material.wireframe = this.wireframe;
        }
    }

    update() {
        
    }
}

export { MyContents };