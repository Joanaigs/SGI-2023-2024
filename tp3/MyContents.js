import * as THREE from 'three';
import { MyAxis } from './classes/MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyTexture } from './classes/MyTexture.js';
import { MyVideoTexture } from './classes/MyVideoTexture.js';

import { MyMaterial } from './classes/MyMaterial.js';
import { MyLights } from './classes/MyLights.js';
import { MyNodeParser } from './MyNodeParser.js';
import { MyGame } from './game/MyGame.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {

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
        this.lightsTree = new Map();
        this.lightsHouse = new Map();
        this.lightTreeEnabled = "on";
        this.lightsHelper = new Map();
        this.numcookies = 4;
        this.lightEnabled = {};
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
        this.reader.open("scenes/scene/scene.xml");
        this.axisVisible = false
       
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
            this.axis.visible = false
        }
    }

    /**
     * Called when the scene xml file load is complete
     * @param {MySceneData} data the entire scene data object
     */
    onSceneLoaded(data) {
        this.onAfterSceneLoadedAndBeforeRender(data);
        this.game = new MyGame(this.app);

    }

    /**
     * From the scene data, creates the scene objects
     * @param {MySceneData} data the entire scene data object
     */
    onAfterSceneLoadedAndBeforeRender(data) {

        // update the scene globals
        this.app.scene.updateGlobals(data.options, data.fog, data.skyboxes);

        // create the lights
        this.app.initCameras(data.cameras, data.activeCameraId)

        // create the lights
        for (var key in data.textures) {
            let myTexture = null;
            let texture = data.textures[key]
            if (texture.isVideo) {
                myTexture = new MyVideoTexture(texture);
            }
            else {
                myTexture = new MyTexture();
                myTexture.init(texture);
            }
            this.textures.set(texture.id, myTexture);
        }

        // create the materials
        for (var key in data.materials) {
            let material = data.materials[key];
            let texture = this.getTexture(material.textureref);
            let bumpTexture = null
            let specularTexture = null
            if (material.bumpref !== null) {
                bumpTexture = this.getTexture(material.bumpref);
            }
            if (material.specularMapRef !== null) {
                specularTexture = this.getTexture(material.specularref);
            }
            this.materials.set(material.id, new MyMaterial(material, texture, bumpTexture, specularTexture));
        }

        // create the scene
        this.nodeParser = new MyNodeParser(this, data);
        this.nodeParser.init();
    }

    /**
     * Returns the texture object
     * @param {THREE.Texture} id texture id
     * @returns {THREE.Texture} the texture object
     */
    getTexture(id) {
        return this.textures.get(id);
    }


    /**
     * Updates the scene
     */
    update() {
        this.game.update();

        
    }
}

export { MyContents };