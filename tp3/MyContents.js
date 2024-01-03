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
                let shader = new MyShader(material.shadervert,material.shaderfrag, uniforms);
                shader.id = material.id;
                this.shaders.push(shader);
                
            
            }
            else
                this.materials.set(material.id, new MyMaterial(material, texture, bumpTexture, specularTexture));
        }

    }

    /**
     * waits for the shaders to load. Then creates the rest of the scene and starts the game
     */
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
        this.candyCanes();
        this.chupaChups();
        this.lolipops();
        this.icecream();
        this.game = new MyGameLogic(this.app);
    }

    /**
     * creates the candy canes
     */
    candyCanes(){
        let candyCane = this.nodeObjects.get("fullCandyCane");
        this.objectsPositions = [];
        //create random positions and scales
        let minx = -1000;
        let maxx = 1000;
        let minz = -1000;
        let maxz = 1000;

        let minscale = 0.5;
        let maxscale = 1.5;

        for(let i = 0; i < 10; i++){
            let x;
            let z;
            do {
                x = Math.random() * (maxx - minx) + minx;
                z = Math.random() * (maxz - minz) + minz;
            } while ((x > -170 && x < 370 && z > -170 && z < 690) || this.isTooClose(x, z, this.objectsPositions));
            let y = 120;
            let rotation = Math.random() * (2*Math.PI);
            let object = candyCane.clone();
            this.removeshadows(object);
            object.position.set(x,y,z);
            object.scale.set(100, 100, 100);
            object.rotation.y = rotation;

            this.app.scene.add(object);
            this.objectsPositions.push({x: x, z: z});
        }

    }

    /**
     * creates the chupa chups
     */
    chupaChups(){
        let chupaChup = this.nodeObjects.get("chupachupalod");
        this.objectsPositions = [];
        //create random positions and scales
        let minx = -1000;
        let maxx = 1000;
        let minz = -1000;
        let maxz = 1000;

        const pastelColors = [
            0xFFB6C1, 
            0xaaaaff, 
            0xaaffaa, 
            0xff5555, 
        ];
    

        let minscale = 5;
        let maxscale = 20;

        for(let i = 0; i < 20; i++){
            let x;
            let z;
            do {
                x = Math.random() * (maxx - minx) + minx;
                z = Math.random() * (maxz - minz) + minz;
            } while ((x > -170 && x < 370 && z > -170 && z < 690) || this.isTooClose(x, z, this.objectsPositions));
            let randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            let scale = Math.random() * (maxscale - minscale) + minscale;
            let y = 20 + scale/2;
            let rotation = Math.random() * (2*Math.PI);
            let object = chupaChup.clone();
            for(let i = 0; i < object.children.length; i++){
                for(let j = 0; j < object.children[i].children.length-1; j++){
                    let mat=object.children[i].children[j].children[0].material
                    let matClone = mat.clone();
                    matClone.color.setHex(randomColor);
                    object.children[i].children[j].children[0].material = matClone;
                }
            }
            object.position.set(x,y,z);
            object.scale.set(scale, scale, scale);
            object.rotation.y = rotation;
            this.app.scene.add(object);
            this.objectsPositions.push({x: x, z: z});
        }
    }

    /**
     * creates the lolipops
     */
    lolipops(){
        let lolipop = this.nodeObjects.get("lolipopObject");
        this.objectsPositions = [];
        //create random positions and scales
        let minx = -1000;
        let maxx = 1000;
        let minz = -1000;
        let maxz = 1000;

        const pastelColors = [
            0xFFC0CD, 
            0xbbbbff, 
            0xbbffbb, 
            0xff8888, 
        ];

        let minscale = 5;
        let maxscale = 20;

        for(let i = 0; i < 20; i++){
            let x;
            let z;
            do {
                x = Math.random() * (maxx - minx) + minx;
                z = Math.random() * (maxz - minz) + minz;
            } while ((x > -170 && x < 370 && z > -170 && z < 690) || this.isTooClose(x, z, this.objectsPositions));
            let scale = Math.random() * (maxscale - minscale) + minscale;
            let y = 20 + scale/2;
            let rotation = Math.random() * (2*Math.PI);
            let object = lolipop.clone();
            object.position.set(x,y,z);
            object.scale.set(scale, scale, scale);
            object.rotation.y = rotation;
            let material = object.children[0].children[0].material;
            let cloneMaterial = material.clone();
            let colorvec3 = new THREE.Color(pastelColors[Math.floor(Math.random() * pastelColors.length)]);
            cloneMaterial.uniforms["color"].value = new THREE.Vector3(colorvec3.r, colorvec3.g, colorvec3.b);
            object.children[0].children[0].material = cloneMaterial;
            this.app.scene.add(object);
            this.objectsPositions.push({x: x, z: z});
        }
    }

    /**
     * creates the icecreams
     */
    icecream(){
        let icecream = this.nodeObjects.get("icecreamBall3");
        this.objectsPositions = [];
        //create random positions and scales
        let minx = -1000;
        let maxx = 1000;
        let minz = -1000;
        let maxz = 1000;

        let minscale = 5;
        let maxscale = 30;

        for(let i = 0; i < 10; i++){
            let x;
            let z;
            do {
                x = Math.random() * (maxx - minx) + minx;
                z = Math.random() * (maxz - minz) + minz;
            } while ((x > -170 && x < 370 && z > -170 && z < 690) || this.isTooClose(x, z, this.objectsPositions));
            let scale = Math.random() * (maxscale - minscale) + minscale;
            let y = 10 + scale/2;
            let rotation = Math.random() * (2*Math.PI);
            let object = icecream.clone();
            object.position.set(x,y,z);
            object.scale.set(scale, scale, scale);
            this.removeshadows(object);
            object.rotation.y = rotation;
            console.log(object);
            this.app.scene.add(object);
            this.objectsPositions.push({x: x, z: z});
        }
    }

    /**
     * Removes shadows from the object
     * @param {*} obj 
     */
    removeshadows(obj){
        for(let i = 0; i < obj.children.length; i++){
            if(obj.children[i].type == "Mesh"){
                obj.children[i].castShadow = false;
            }
            else{
                this.removeshadows(obj.children[i]);
            }
        }
    }




    /**
     * Checks if the new position is too close to any existing positions
     * @param {*} newX 
     * @param {*} newZ 
     * @param {*} existingPositions 
     * @returns 
     */
    isTooClose(newX, newZ, existingPositions) {
        // Check if the new position is too close to any existing positions
        for (let position of existingPositions) {
            let distance = Math.sqrt((newX - position.x) ** 2 + (newZ - position.z) ** 2);
            if (distance < 200) { // Adjust this value based on your preference for minimum distance
                return true;
            }
        }
        return false;
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