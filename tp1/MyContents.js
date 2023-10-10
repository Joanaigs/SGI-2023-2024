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
import { MyDoor } from './MyDoor.js';
import { MyWindow } from './MyWindow.js';
import { MyCarocha } from './MyCarocha.js';
import { MyCoil } from './MyCoil.js';
import { MyRoundVase } from './MyRoundVase.js';
import {MyFlower} from './MyFlower.js';
import { MyJornal } from './MyJornal.js';
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
        this.lastFloorEnabled = null

        // plane related attributes
        this.wrapping_mode_u = 'Repeat';
        this.wrapping_mode_v = 'Repeat';
        let planeSizeU = 30;
        let planeSizeV = 45;
        let planeUVRate = planeSizeV / planeSizeU;
        let planeTextureUVRate = 612 / 407; // image dimensions
        this.repeat_u = 3;
        this.repeat_v = this.repeat_u * planeUVRate * planeTextureUVRate;
        this.offset_u = 0;
        this.offset_v = 0;
        this.rotation = 0;
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 50;
        this.planeMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess });
        //spotlight
        this.lightColor = "#ffffff";
        this.lightIntensity = 2;
        this.lightDistance = 0;
        this.lightAngle = 70;
        this.lightPenumbra = 1;
        this.lightDecay = 0;
        this.lightPosition = new THREE.Vector3(0, 15, 0);
        this.lightTarget = new THREE.Vector3(0, 2, -3);

        //textures
        this.materialJornal =new THREE.TextureLoader().load('textures/jornal.jpg');
        this.materialJornal.wrapT = THREE.MirroredRepeat;
        this.materialJornal.repeat.y=-1;

    
        
        
        // other attributes
        this.cake = null;
        this.floor=null
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
        this.cake.position.x = this.cakeDisplacement.x;
        this.cake.position.y = this.cakeDisplacement.y;
        this.cake.position.z = this.cakeDisplacement.z;
        this.app.scene.add(this.cake);
    }

    buildFloor(){
        let planeTexture =new THREE.TextureLoader().load('textures/floor.jpg');
        if(this.wrapping_mode_u === 'ClampToEdge'){
            planeTexture.wrapS = THREE.ClampToEdgeWrapping;
        }
        else if(this.wrapping_mode_u === 'Repeat'){
            planeTexture.wrapS = THREE.RepeatWrapping;
        }
        else if(this.wrapping_mode_u === 'MirroredRepeat'){
            planeTexture.wrapS = THREE.MirroredRepeatWrapping;
        }
        if(this.wrapping_mode_v === 'ClampToEdge'){
            planeTexture.wrapT = THREE.ClampToEdgeWrapping;
        }
        else if(this.wrapping_mode_v === 'Repeat'){
            planeTexture.wrapT = THREE.RepeatWrapping;
        }
        else if(this.wrapping_mode_v === 'MirroredRepeat'){
            planeTexture.wrapT = THREE.MirroredRepeatWrapping;
        }
        planeTexture.repeat.set(this.repeat_u, this.repeat_v);
        planeTexture.rotation = this.rotation;
        planeTexture.offset = new THREE.Vector2(this.offset_u,this.offset_v);
        this.planeMaterial.map = planeTexture;
        var plane = new THREE.PlaneGeometry( 30, 45 );
        this.floor = new THREE.Mesh( plane, this.planeMaterial );
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.position.y = 0;
        this.floor.position.z = 15 / 3 + 2.5;
        
        this.app.scene.add(this.floor);


    }
    buildSpotlight(){
        this.spotlight = new THREE.SpotLight(this.lightColor, this.lightIntensity, this.lightDistance, 
            this.lightAngle*(Math.PI/180), this.lightPenumbra, this.lightDecay);
        this.spotlight.position.set(this.lightPosition.x, this.lightPosition.y, this.lightPosition.z);
        this.targetSpot = new THREE.Object3D();
        this.targetSpot.position.set(this.lightTarget.x, this.lightTarget.y, this.lightTarget.z);
        this.app.scene.add(this.targetSpot);
        this.spotlight.target=this.targetSpot;
        this.app.scene.add(this.spotlight);
        //this.spotLightHelper = new THREE.SpotLightHelper(this.spotlight, 0xffffff );
        //this.app.scene.add(this.spotLightHelper)
    }

    /**
     * initializes the contents
     */
    init() {
       
        // create once 
        if (this.axis === null) {
            // create and attach the axis to the scene
            this.axis = new MyAxis(this);
            this.app.scene.add(this.axis);
        }

        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 50, 0 );
        pointLight.position.set( 0, 20, 7.5 );
        this.app.scene.add( pointLight );

        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        this.app.scene.add( pointLightHelper );

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0xeeeeee, 0.05 );
        this.app.scene.add( ambientLight );


        this.buildBox()
        this.buildCake()
        this.buildFloor()
        this.buildSpotlight()

        if(this.house === null){      
            this.house = new  MyHouse(this);
            this.app.scene.add(this.house);
        }
        this.table = new MyTable(this, 6,3.5,1.95,"textures/top.jpg", "textures/tableLegs.jpg", [0, 0, 0]);
        this.app.scene.add(this.table); 

        this.carpet = new MyCarpet(this,0x8eb1c2, [0, 0, 0]);
        this.app.scene.add(this.carpet); 

        this.robot = new MyRobot(this, 0x5d2906, [-4, -0.3, 3.9]);
        this.app.scene.add(this.robot); 
        
        this.vase = new MyVase(this, 1, 0xc8dfea, [-12.5, 0, -13]);
        this.app.scene.add(this.vase);

        this.lampshade = new MyLampshade(this, 7, 1.75, 1.5, "textures/metal.jpg", 0xffffff, [12, 0, -12]);
        this.app.scene.add(this.lampshade);
        this.addSpotLightLamp([12, 7.5, -12], [12, 0, -12], 40)

        this.cakePiece = new MyCakePiece(this, 0xffdbe9, [1.2, 2.42, 6.8]);
        this.app.scene.add(this.cakePiece);
        
        this.sofa1 = new MySofa(this, 1, 0x365563, 0x446879, [0,0, 9], 10 );
        this.app.scene.add(this.sofa1);

        this.sofa2 = new MySofa(this, 1, 0X365563, 0x446879, [0,0, 0], 5 );
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
        this.joanaPhoto = new MyFrame(this, 0.5,4, 4, 0x5d2906, [3.2, 6, 30-0.25],0, "textures/flowersPainting.jpg", "textures/floor1.jpg", false);
        this.app.scene.add(this.joanaPhoto);

        this.inesPhoto = new MyFrame(this, 0.5,4, 4, 0x5d2906, [-3.2, 5.3, 30-0.25],0, "textures/housePainting.jpg", "textures/floor1.jpg", false);
        this.app.scene.add(this.inesPhoto);


        this.window = new MyWindow(this, "textures/transferir.jpg", "textures/metal.jpg", true);
        this.app.scene.add(this.window);


        //televison
        this.television= new MyFrame(this, 0.3,10, 5, 0x5d2906, [0, 5, -15+0.25],Math.PI);
        this.app.scene.add(this.television);

        // televison Bottom cabinet
        this.televisionBottomCabinet = new MyCabinet(this, 16, 2, 3, 0x373737, [-2,0, -14], false, 0);
        this.app.scene.add(this.televisionBottomCabinet);

        //bookshelf cabinet
        this.bookshelf = new MyCabinet(this, 4, 2, 5, 0x373737, [-8,5, -14], true, 3 );
        this.app.scene.add(this.bookshelf);

         //bookshelf cabinet
         this.bookshelf2 = new MyCabinet(this, 8, 2, 10, 0x373737, [0,2, -14], true,4);
         this.bookshelf2.rotateY(-Math.PI/2)
         this.app.scene.add(this.bookshelf2);

        //back table
        this.backTable = new MyTable(this, 12, 5,4, "textures/top.jpg","textures/tableLegs.jpg", [0, 0, 10.5], true);
        this.app.scene.add(this.backTable); 

        // door
        this.door = new MyDoor(this, 5, 12,0.5, "textures/top.jpg", "textures/metal.jpg", [7.4, 0, 8]);
        this.app.scene.add(this.door); 

        this.lampshadeCeiling1 = new MyLampshade(this, 0.7, 0.6, 0.5, "textures/metal.jpg", 0xffffff, [0, 15, 0],Math.PI/16, true);
        this.app.scene.add(this.lampshadeCeiling1);

        this.lampshadeCeiling2 = new MyLampshade(this, 0.7, 0.6, 0.5, "textures/metal.jpg", 0xffffff, [0, 15, 18], -Math.PI/16, true);
        this.app.scene.add(this.lampshadeCeiling2);
        this.addSpotLightLamp([0, 15, 18], [0, 0, 21], 70)


        this.carocha = new MyCarocha(this, "textures/floor1.jpg", [14.75, 6, 22], -Math.PI/2, 1);
        this.app.scene.add(this.carocha);

        //coil
        this.coil = new MyCoil(this, 0.5, 8, 0.07, [2, 4.6, 21], Math.PI/4);
        this.app.scene.add(this.coil);

        this.roundVase= new MyRoundVase(this, 0.8, 0xc8dfea, [0, 6, 21]);
        this.app.scene.add(this.roundVase);

        this.flower = new MyFlower(this, 2, 0xffb6c1, [0, 5, 21], 0);
        this.app.scene.add(this.flower);
        this.flower = new MyFlower(this, 2, 0xffb6c1, [0.2, 4.5, 21],0);
        this.app.scene.add(this.flower);

        this.jornal= new MyJornal(this, 1, [-10, 1.4, -1], Math.PI/16, 4, 0.5);
        this.app.scene.add(this.jornal);

    }

    addSpotLightLamp(lampPosition,targetPostion, lightAngle){
        let spotlightLamp = new THREE.SpotLight(0xffffff, 2, 0, lightAngle*(Math.PI/180), 1, 0);
        spotlightLamp.position.set(lampPosition[0], lampPosition[1], lampPosition[2]);
        let target = new THREE.Object3D();
        this.app.scene.add(target);
        target.position.set(targetPostion[0], targetPostion[1], targetPostion[2]);
        spotlightLamp.target = target;
        this.app.scene.add(spotlightLamp);

        //let spotLightLampHelper = new THREE.SpotLightHelper(spotlightLamp);
        //this.app.scene.add(spotLightLampHelper);

        console.log('Light position:', spotlightLamp.position);
        console.log('Light target position:', spotlightLamp.target.position);
    }
    
    /**
     * updates the diffuse plane color and the material
     * @param {THREE.Color} value 
     */
    updateDiffusePlaneColor(value) {
        this.diffusePlaneColor = value;
        this.planeMaterial.color.set(this.diffusePlaneColor);
    }
    /**
     * updates the specular plane color and the material
     * @param {THREE.Color} value 
     */
    updateSpecularPlaneColor(value) {
        this.specularPlaneColor = value;
        this.planeMaterial.specular.set(this.specularPlaneColor);
    }
    /**
     * updates the plane shininess and the material
     * @param {number} value 
     */
    updatePlaneShininess(value) {
        this.planeShininess = value;
        this.planeMaterial.shininess = this.planeShininess;
    }
    
    /**
     * rebuilds the box mesh if required
     * this method is called from the gui interface
     */
    rebuildBox() {
        // remove boxMesh if exists
        if (this.boxMesh !== undefined && this.boxMesh !== null) {  
            this.app.scene.remove(this.boxMesh);
        }
        this.buildBox();
        this.lastBoxEnabled = null;
    }

    rebuildFloor(){
        if(this.floor !== undefined && this.floor !== null){
            this.app.scene.remove(this.floor);
        }
        this.buildFloor();
    }

    rebuildSpotlight(){
        if(this.spotlight !== undefined && this.spotlight !== null){
            this.app.scene.remove(this.spotlight);
            this.app.scene.remove(this.targetSpot);
            //this.app.scene.remove(this.spotLightHelper);
        }
        this.buildSpotlight();
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


    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
        // check if box mesh needs to be updated
        this.updateBoxIfRequired()

        // sets the box mesh position based on the displacement vector
        this.boxMesh.position.x = this.boxDisplacement.x
        this.boxMesh.position.y = this.boxDisplacement.y
        this.boxMesh.position.z = this.boxDisplacement.z

        
    }

}

export { MyContents };