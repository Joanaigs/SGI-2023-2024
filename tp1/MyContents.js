import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyHouse } from './MyHouse.js';
import { MyTable } from './MyTable.js';
import { MyPlate } from './MyPlate.js';
import { MyCake } from './MyCake.js';
import { MyVase } from './MyVase.js';
import { MyCarpet } from './MyCarpet.js';
import { MyLampshade } from './MyLampshade.js';
import { MyRobot } from './MyRobot.js';
import { MyCakePiece } from './MyCakePiece.js';
import { MySofa } from './MySofa.js';
import { MyFrame } from './MyFrame.js';
import { MyCabinet } from './MyCabinet.js';
import { MyWindow } from './MyWindow.js';
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
        this.planeTexture =
        new THREE.TextureLoader().load('textures/floor1.jpg');
        this.planeTexture.wrapS = THREE.RepeatWrapping;
        this.planeTexture.wrapT = THREE.RepeatWrapping;

        this.diffusePlaneColor = "#FFFFFF"
        this.specularPlaneColor = "#777777"
        this.planeShininess = 100
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.planeTexture })

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
        const ambientLight = new THREE.AmbientLight( 0xffffff );
        this.app.scene.add( ambientLight );

        this.buildBox()
        this.buildCake()
        
        // Create a Plane Mesh with basic material
        if(this.house === null){ 
            console.log("house")       
            this.house = new  MyHouse(this);
            this.app.scene.add(this.house);
        }
        this.table = new MyTable(this, 6,3.5,2,0xffffff, 0x5d2906, [0, 0, 0]);
        this.app.scene.add(this.table); 

        this.carpet = new MyCarpet(this,0xffffff, [0, 0, 0]);
        this.app.scene.add(this.carpet); 

        //this.robot = new MyRobot(this, 0x5d2906, [0, 0, 0]);
        //this.app.scene.add(this.robot); 
        
        //this.vase = new MyVase(this, 1, 0x36454F, [8, 0, -8]);
        //this.app.scene.add(this.vase);

        this.lampshade = new MyLampshade(this, 7, 1.5, 0x36454F, 0xffffff, [12, 0, -12]);
        this.app.scene.add(this.lampshade);

        this.cakePiece = new MyCakePiece(this, 0xffdbe9, [2, 2, 0]);
        this.app.scene.add(this.cakePiece);
        
        this.sofa1 = new MySofa(this, 1, 0x373737, 0x5d5d5d, [0,0, 9], 10 );
        this.app.scene.add(this.sofa1);

        this.sofa2 = new MySofa(this, 1, 0x373737, 0x5d5d5d, [0,0, 0], 5 );
        this.sofa2.rotation.y = -Math.PI/2;
        this.sofa2.position.x = -9;
        this.app.scene.add(this.sofa2);

        // Pile of plates
        for(let i = 0; i < 5; i++){
            let plate = new MyPlate(this, 0.5, 0xf5e9dc, [-2, 2, 0]);
            plate.position.y += i*plate.plateHeight();
            this.app.scene.add(plate);
        }

        // frame
        this.joanaPhoto = new MyFrame(this, 0.5,4, 4, 0x5d2906, [3.2, 6, 30-0.25],0);
        this.app.scene.add(this.joanaPhoto);

        this.inesPhoto = new MyFrame(this, 0.5,4, 4, 0x5d2906, [-3.2, 5.3, 30-0.25],0);
        this.app.scene.add(this.inesPhoto);

        // window
        this.window = new MyWindow(this, 0.5,6, 8, 0x5d2906, [-15+0.25, 4, 5],-Math.PI/2);
        this.app.scene.add(this.window);

        //televison
        this.television= new MyFrame(this, 0.3,10, 5, 0x5d2906, [0, 5, -15+0.25],Math.PI);
        this.app.scene.add(this.television);

        // televison Bottom cabinet
        this.televisionBottomCabinet = new MyCabinet(this, 16, 2, 3, 0x373737, [-2,0, -14], false );
        this.app.scene.add(this.televisionBottomCabinet);

        //bookshelf cabinet
        this.bookshelf = new MyCabinet(this, 4, 2, 5, 0x373737, [-8,5, -14], true, 3 );
        this.app.scene.add(this.bookshelf);

        //back table
        this.backTable = new MyTable(this, 12, 5,4,0xffffff, 0x5d2906, [0, 0, 10.5]);
        this.app.scene.add(this.backTable); 


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