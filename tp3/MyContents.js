import * as THREE from 'three';
import { MyAxis } from './classes/MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyTexture } from './classes/MyTexture.js';
import { MyVideoTexture } from './classes/MyVideoTexture.js';

import { MyMaterial } from './classes/MyMaterial.js';
import { MyLights } from './classes/MyLights.js';
import { MyNodeParser } from './MyNodeParser.js';
import { MyGameLogic } from './game/MyGameLogic.js';
import { MyShader } from './game/MyShader.js';

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
        this.data = data;
        // create the scene
        this.waitForshaders();
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
        this.shaders = [];

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
            if(material.shaderfrag){
                let uniforms = {};
                //uniforms are sepearted by a comma, name, type, value
                console.log(material.shaderuniforms);
                let uniform = material.shaderuniforms.split(",");
                for(let i=0; i<uniform.length; i++){
                    let uniformName = uniform[i].split(" ")[0];
                    let uniformType = uniform[i].split(" ")[1];
                    let uniformValue = uniform[i].split(" ")[2];
                    if(uniformType == "float"){
                        uniforms[uniformName] = {type: "f", value: parseFloat(uniformValue)};
                    }
                    else if(uniformType == "sampler2D"){
                        uniforms[uniformName] = {type: "sampler2D", value: new THREE.TextureLoader().load(uniformValue)};
                    }
                }

                uniforms["color"] = {type: "vec4", value: new THREE.Vector4(material.color.r, material.color.g, material.color.b, material.color.a)};
                console.log(uniforms);
                let shader = new MyShader(material.shadervert,material.shaderfrag, uniforms);
                shader.id = material.id;
                this.shaders.push(shader);
                
            
            }
            else
                this.materials.set(material.id, new MyMaterial(material, texture, bumpTexture, specularTexture));
        }

    }

    waitForshaders(){
        for(let i = 0; i < this.shaders.length; i++){
            if (this.shaders[i].ready === false) {
                setTimeout(this.waitForshaders.bind(this), 100)
                return;
            }
        }
        for(let i = 0; i < this.shaders.length; i++){
            this.materials.set(this.shaders[i].id, this.shaders[i].material);
        }
        this.nodeParser = new MyNodeParser(this, this.data);
        this.nodeParser.init();
        this.game = new MyGameLogic(this.app);
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
        if(this.game)
            this.game.update();

        
    }
}

export { MyContents };