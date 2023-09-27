import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyHouse } from './MyHouse.js';
import { MyTable } from './MyTable.js';
import { MyPlate } from './MyPlate.js';
import { MyCake } from './MyCake.js';
import { MyVase } from './MyVase.js';
import { MyCakePiece } from './MyCakePiece.js';
import { MySofaOne } from './MySofaOne.js';
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
        this.house = null

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = false
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0,2,0)

        //cake related attributes
        this.cake = null
        this.cakeSize = 1.0
        this.cakeEnabled = true
        this.cakeDisplacement = new THREE.Vector3(0,2,0)
        this.cakeSize = 1.0
        this.lastCakeEnabled = null

        // plane related attributes
        this.diffusePlaneColor = "#00ffff"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 30
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.diffusePlaneColor, emissive: "#000000", shininess: this.planeShininess })

        this.cake = null;
    }

    /**
     * builds the box mesh with material assigned
     */
    buildBox() {    
        let boxMaterial = new THREE.MeshPhongMaterial({ color: "#ffff77", 
        specular: "#000000", emissive: "#000000", shininess: 90 })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(  this.boxMeshSize,  this.boxMeshSize,  this.boxMeshSize );
        this.boxMesh = new THREE.Mesh( box, boxMaterial );
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    buildCake(){
        this.cake = new MyCake(this, 0xffdbe9);
        this.cake.scale.set(this.cakeSize,this.cakeSize,this.cakeSize);
        this.cake.position.x = this.cakeDisplacement.x
        this.cake.position.y = this.cakeDisplacement.y
        this.cake.position.z = this.cakeDisplacement.z
        this.app.scene.add(this.cake);
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

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 500, 0 );
        pointLight.position.set( 0, 20, 0 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0x555555 );
        this.app.scene.add( ambientLight );

        this.buildBox()
        this.buildCake()
        
        // Create a Plane Mesh with basic material
        if(this.house === null){ 
            console.log("house")       
            this.house = new  MyHouse(this);
            this.app.scene.add(this.house);
        }

        this.table = new MyTable(this, 10,5,2, 0x5d2906, [0, 0, 0]);
        this.app.scene.add(this.table); 

        this.vase = new MyVase(this, 0.5, 0x36454F, [0, 0, 0]);
        this.app.scene.add(this.vase);

        this.cakePiece = new MyCakePiece(this, 0xffdbe9, [2, 2, 0]);
        this.app.scene.add(this.cakePiece);
        
        this.sofa = new MySofaOne(this, 1, 0xA0816C, [0,0, 8], 10 );
        this.app.scene.add(this.sofa);
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value
        this.planeMaterial.color.set(this.diffusePlaneColor)
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value
        this.planeMaterial.specular.set(this.specularPlaneColor)
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value
        this.planeMaterial.shininess = this.planeShininess
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh)
        }
        this.buildBox();
        this.lastBoxEnabled = null
    }

    rebuildCake() {
        if(this.cake !== undefined && this.cake !== null){
            this.app.scene.remove(this.cake);
        }
        this.buildCake();
        this.lastCakeEnabled = null;
        
    }
    
    /**
     * updates the box mesh if required
     * this method is called from the render method of the app
     * updates are trigered by boxEnabled property changes
     */
    updateBoxIfRequired() {
        if (this.boxEnabled !== this.lastBoxEnabled) {
            this.lastBoxEnabled = this.boxEnabled
            if (this.boxEnabled) {
                this.app.scene.add(this.boxMesh)
            }
            else {
                this.app.scene.remove(this.boxMesh)
            }
        }
    }

    updateCakeIfRequired() {
        if (this.cakeEnabled !== this.lastCakeEnabled) {
            this.lastCakeEnabled = this.cakeEnabled
            console.log(this.cakeEnabled)
            if (this.cakeEnabled) {
                this.app.scene.add(this.cake)
            }
            else {
                this.app.scene.remove(this.cake)
            }
        }
    }


    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()
        this.updateCakeIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z

        this.cake.scale.set(this.cakeSize,this.cakeSize,this.cakeSize);
        this.cake.position.x = this.cakeDisplacement.x
        this.cake.position.y = this.cakeDisplacement.y
        this.cake.position.z = this.cakeDisplacement.z
        
    }

}

export { MyContents };