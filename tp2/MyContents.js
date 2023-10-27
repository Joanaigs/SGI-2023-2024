import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyFileReader } from './parser/MyFileReader.js';
import { MyTexture } from './MyTexture.js';
import { MyMaterial } from './MyMaterial.js';
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
        this.textures = new Map();
        this.materials = new Map();
        this.lights = new Map();
        this.objects = new Map();	
        this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scenes/demo/demo.xml");	
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

        // cube
        let geometry = new THREE.BoxGeometry(1, 1, 1)
        let cube = new THREE.Mesh(geometry, this.materials.get("tableApp"))
        this.app.scene.add(cube)
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
        console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""))
    }

    onAfterSceneLoadedAndBeforeRender(data) {
        // refer to descriptors in class MySceneData.js
        // to see the data structure for each item

        this.output(data.options)
        this.app.scene.updateGlobals(data.options)
        this.app.initCameras(data.cameras, data.activeCameraId)


        console.log("textures:")
        for (var key in data.textures) {
            let texture = data.textures[key]
            console.log( new MyTexture(texture))
            this.textures.set(texture.id, new MyTexture(texture));
            this.output(texture, 1)
        }
        console.log(this.myScene);

        console.log("materials:")
        for (var key in data.materials) {
            let material = data.materials[key];
            let texture = this.getTexture(material.textureref);
            this.materials.set(material.id, new MyMaterial(material, texture));
            this.output(material, 1);
        }

        console.log("nodes:")
        for (var key in data.nodes) {
            let node = data.nodes[key]
            this.output(node, 1)
            for (let i=0; i< node.children.length; i++) {
                let child = node.children[i]
                if (child.type === "primitive") {
                    console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
                    if (child.subtype === "nurbs") {
                        console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
                    }
                }
                else {
                    this.output(child, 2)
                }
            }
        }
    }

    getTexture(id){
        return this.textures.get(id);
    }

    update() {
        
    }
}

export { MyContents };