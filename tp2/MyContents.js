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
        this.milkHeight = 0.4;
        this.milkOriginalHeight = 0.4;
        this.wireframe = false;
        this.santaPos = 0;
        this.santaOriginalY = 4;
        this.candleOn = true;
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
     * Turns on/off the light
     * @param {string} id 
     */
    updateLights(id) {
        let light = this.lights.get(id);
        if (light) {
            light.visible = this.lightEnabled[id];
        }
    }

    /**
     * Changes the wireframe property of the materials
     */
    updateWireframe() {
        for (let material of this.materialsObjects) {
            material.wireframe = this.wireframe;
        }
    }

    /**
     * Updates the position of santa
     * @param {number} value position of santa
     */
    updateSantaPosition(value) {
        let santa = this.nodeObjects.get("santa");
        santa.position.y = this.santaOriginalY + value;
    }

    /**
     * Changes the texture of the socks
     * @param {string} value id of the texture
     */
    updateSockTexture(value) {
        this.sockTexture = value;
        let sock1 = this.nodeObjects.get("sock1");
        let sock1Mesh = sock1.children[0].children[0]
        let sock2 = this.nodeObjects.get("sock2");
        let sock2Mesh = sock2.children[0].children[0]
        let sock3 = this.nodeObjects.get("sock3");
        let sock3Mesh = sock3.children[0].children[0]
        if (value == "red") {
            sock1Mesh.material = this.materials.get("sock1App");
            sock2Mesh.material = this.materials.get("sock1App");
            sock3Mesh.material = this.materials.get("sock1App");

        }
        else if (value == "green") {
            sock1Mesh.material = this.materials.get("sock2App")
            sock2Mesh.material = this.materials.get("sock2App");
            sock3Mesh.material = this.materials.get("sock2App");
        }
    }

    /**
     * Updates the lights of the tree. Has three options: on, off and blinking
     */
    updateTreeLights() {
        for (let key of this.lights.keys()) {
            if (key.includes("lightTree")) {
                let light = this.lights.get(key);
                if (this.lightTreeEnabled == "on") {
                    light.visible = true;
                }
                else if (this.lightTreeEnabled == "off") {
                    light.visible = false;
                }
                else if (this.lightTreeEnabled == "blinking") {
                    light.visible = true;
                }
            }
        }
    }

    /**
     * Updates the height of the cylinder that represents the milk
     * @param {number} value height of the milk
     */
    updateMilk(value) {
        let milk = this.nodeObjects.get("milk").children[0];
        let proportion = value / this.milkOriginalHeight;

        // Calculate the change in height
        let deltaY = (this.milkOriginalHeight - value) / 2;

        // Scale the milk
        milk.scale.y = proportion;

        // Update the y position to keep the bottom in the same place
        milk.position.y = -0.2 + value / 2;
    }

    /**
     * 
     * @returns a random color from a list of christmas colors
     */
    getRandomColor() {
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

    /**
     * Changes the number of cookies in the scene
     * @param {number} value number of cookies
     */
    updateCookies(value) {
        this.numcookies = value;
        for (let i = 0; i < 4; i++) {
            if (i < value) {
                let cookies = this.nodeObjects.get(this.cookieList[i]);
                cookies.children[0].visible = true;
            }
            else {
                let cookies = this.nodeObjects.get(this.cookieList[i]);
                cookies.children[0].visible = false;
            }
        }
    }

    /**
     * Change the color of all the tree decorations(balls)
     * @param {hex} value color of the tree decorations 
     */
    updateTreeDecorationValue(value) {
        this.treeDecoration = value;
        let tree = this.nodeObjects.get("christmasTree");
        let decorations = tree.children[0].children[6];
        for (let decoration of decorations.children) {
            decoration.children[0].material.color.set(this.treeDecoration);
        }


    }

    /**
     * Changes the color of all the tree decorations(balls) to a random color
     */
    updateTreeDecorationRandom() {
        let tree = this.nodeObjects.get("christmasTreeLod");
        let decorations = tree.children[0].children[6];
        for (let decoration of decorations.children) {

            decoration.children[0].material.color.set(this.getRandomColor());

        }
    }


    /**
     * Changes the visibility of the lights of the tree to simulate blinking
     */
    toggleBlinkingLights() {
        for (let key of this.lights.keys()) {
            if (key.includes("lightTree")) {
                let light = this.lights.get(key);
                light.visible = !light.visible;
            }
        }
    }

    /**
     * updates the axis visibility
     */
    updateAxis() {
        if (this.axis !== undefined && this.axis !== null && !this.axisVisible) {
            this.axis.visible = false;
        }
        else if (this.axisVisible) {
            let axis = this.app.scene.getObjectByName("axis");
            this.axis.visible = true;
        }
    }

    updateCandle() {
        let candle1 = this.nodeObjects.get("candle1");
        let candle2 = this.nodeObjects.get("candle2");
        let candle3 = this.nodeObjects.get("candle3");

        if (this.candleOn) {
            candle1.children[4].visible = true;
            candle2.children[4].visible = true;
            candle3.children[4].visible = true;
            candle1.children[5].visible = true;
            candle2.children[5].visible = true;
            candle3.children[5].visible = true;
        }
        else {
            candle1.children[4].visible = false;
            candle2.children[4].visible = false;
            candle3.children[4].visible = false;
            candle1.children[5].visible = false;
            candle2.children[5].visible = false;
            candle3.children[5].visible = false;
        }
    }

    /**
     * Updates the scene
     */
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