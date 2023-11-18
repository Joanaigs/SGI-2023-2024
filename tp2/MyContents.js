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
        this.lightTreeEnabled = "on";
        this.lightTreeOn = true;
        this.lightsHelper = new Map();
        this.treeDecoration = "#ff0000";
        this.treeDecorationRandom = false;
        this.cookieList = ['cookie1', 'cookie2', 'cookie3', 'cookie4']
        this.numcookies = 4;
        this.lightEnabled = {};
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/scene/scene.xml");	
        this.sockTexture = "red";
        this.milkHeight=0.4;
        this.milkOriginalHeight = 0.4;
        this.wireframe = false;
        this.santaPos = 0;
        this.santaOriginalY = 4;
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
            if(texture.isVideo){
                myTexture = new MyVideoTexture(texture);
            }
            else {
                myTexture = new MyTexture();
                myTexture.init(texture);
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

    updateSantaPosition(value){
        let santa = this.nodeObjects.get("santa");
        santa.position.y = this.santaOriginalY + value;
    }

    updateSockTexture(value){
        console.log(this.materials)
        this.sockTexture = value;
        let sock1 = this.nodeObjects.get("sock1");
        let sock1Mesh= sock1.children[0].children[0]
        let sock2 = this.nodeObjects.get("sock2");
        let sock2Mesh= sock2.children[0].children[0]
        let sock3 = this.nodeObjects.get("sock3");
        let sock3Mesh= sock3.children[0].children[0]
        console.log(sock1Mesh)
        if(value == "red"){
            sock1Mesh.material = this.materials.get("sock1App");
            sock2Mesh.material = this.materials.get("sock1App");
            sock3Mesh.material = this.materials.get("sock1App");

        }
        else if(value == "green"){
            sock1Mesh.material = this.materials.get("sock2App")
            sock2Mesh.material = this.materials.get("sock2App");
            sock3Mesh.material = this.materials.get("sock2App");
        }
    }
    updateTreeLights(){
        for( let key of this.lights.keys()){
            if(key.includes("lightTree")){
                let light = this.lights.get(key);
                if(this.lightTreeEnabled == "on"){
                    light.visible = true;
                }
                else if(this.lightTreeEnabled == "off"){
                    light.visible = false;
                }
                else if(this.lightTreeEnabled == "blinking"){
                    console.log(key)
                    light.visible = true;
                }
            }
        }
    }

    updateMilk(value){
        let milk = this.nodeObjects.get("milk").children[0];
        let proportion = value / this.milkOriginalHeight;

        // Calculate the change in height
        let deltaY = (this.milkOriginalHeight - value) / 2;
    
        // Scale the milk
        milk.scale.y = proportion;
    
        // Update the y position to keep the bottom in the same place
        milk.position.y = -0.2+value/2;
    

        console.log(proportion, milk.position.y)
    }

    getRandomColor(){
    var christmasColors = [
        '#ff0000', // Red
        '#800000', // Maroon
        '#ff4500', // Orange Red
        '#b22222', // Fire Brick
        '#2f4f4f', // Dark Slate Gray
        '#8b4513', // Saddle Brown
        '#4682b4', // Steel Blue
        '#d2691e', // Chocolate
        '#20b2aa', // Light Sea Green
        '#800080', // Purple
        '#6b8e23', // Olive Drab
        '#ff69b4'  // Hot Pink
    ];

    var randomIndex = Math.floor(Math.random() * christmasColors.length);
    return christmasColors[randomIndex];
    }

    updateCookies(value){
        this.numcookies = value;
        for(let i = 0; i < 4; i++){
            if(i < value){
                let cookies = this.nodeObjects.get(this.cookieList[i]);
                cookies.children[0].visible = true;
            }
            else{
                let cookies = this.nodeObjects.get(this.cookieList[i]);
                cookies.children[0].visible = false;
            }
        }
    }

    updateTreeDecoration(value){
        this.treeDecoration = value;
        let tree = this.nodeObjects.get("christmasTree");
        let decorations = tree.children[6];
        for(let decoration of decorations.children){
            if(!this.treeDecorationRandom)
                decoration.children[0].material.color.set(value);
            else{
                decoration.children[0].material.color.set(this.getRandomColor());
            }
        }
    }
    toggleBlinkingLights() {
        for (let key of this.lights.keys()) {
            if (key.includes("lightTree")) {
                let light = this.lights.get(key);
                light.visible = !light.visible; 
            }
        }
    }
    
    update() {
        if (this.lightTreeEnabled === "blinking") {
            if (!this.blinkingIntervalId) {
                this.blinkingIntervalId = setInterval(() => {
                    this.toggleBlinkingLights();
                }, 500); 
            }
        } else {
            clearInterval(this.blinkingIntervalId);
            this.blinkingIntervalId = null;
        }
    }
}

export { MyContents };