import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyHouse } from './Solids/House Structure/MyHouse.js';
import { MyTable } from './Solids/Furniture/MyTable.js';
import { MyPlate } from './Solids/Decoration/MyPlate.js';
import { MyCake } from './Solids/Cake/MyCake.js';
import { MyVase } from './Solids/Decoration/MyVase.js';
import { MyCarpet } from './Solids/Decoration/MyCarpet.js';
import { MyBook } from './Solids/Decoration/MyBook.js';
import { MyLampshade } from './Solids/Decoration/MyLampshade.js';
import { MyRobot } from './Solids/MyRobot.js';
import { MyCakePiece } from './Solids/Cake/MyCakePiece.js';
import { MySofa } from './Solids/Furniture/MySofa.js';
import { MyFrame } from './Solids/Decoration/MyFrame.js';
import { MyCabinet } from './Solids/Furniture/MyCabinet.js';
import { MyDoor } from './Solids/House Structure/MyDoor.js';
import { MyWindow } from './Solids/House Structure/MyWindow.js';
import { MyCarocha } from './Curves & Surfaces/MyCarocha.js';
import { MyCoil } from './Curves & Surfaces/MyCoil.js';
import { MyRoundVase } from './Curves & Surfaces/MyRoundVase.js';
import {MyFlower} from './Curves & Surfaces/MyFlower.js';
import { MyJornal } from './Curves & Surfaces/MyJornal.js';
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
        this.lightDistance = 40;
        this.lightAngle = 70;
        this.lightPenumbra = 1;
        this.lightDecay = 0;
        this.lightPosition = new THREE.Vector3(0, 15, 0);
        this.lightTarget = new THREE.Vector3(0, 2, -3);
        //light atributtes
        this.bias = -0.0002

        //shadows
        this.mapSize = 4096

        //Textures
        this.initMaterials()

        
        // other attributes
        this.cake = null;
        this.floor=null
    }

    initMaterials(){

        // floor material
        this.planetexturePath = "Textures/floor.jpg"
        this.planeTexture =new THREE.TextureLoader().load(this.planetexturePath);

        // jornal material
        this.materialJornal =new THREE.TextureLoader().load('Textures/jornal.jpg');
        this.materialJornal.wrapT = THREE.MirroredRepeatWrapping;
        this.materialJornal.rotation = Math.PI/2;
        this.materialJornal.repeat.set(1,  -1);

        // vase material
        this.textureVase = new THREE.TextureLoader().load("Textures/flowersPattern.jpg");
        this.textureVase.wrapS = THREE.RepeatWrapping;
        this.textureVase.wrapT = THREE.RepeatWrapping;

        // curtain material
        this.textureCurtain = new THREE.TextureLoader().load("Textures/curtain.jpg");
        this.textureCurtain.wrapS = THREE.RepeatWrapping;
        this.textureCurtain.wrapT = THREE.RepeatWrapping;
        this.textureCurtain.repeat.set(1,  4);

        // metal material
        this.lightMetalTexture =new THREE.TextureLoader().load("Textures/metal.jpg");
        this.lightMetalTexture.wrapS = THREE.MirroredRepeatWrapping;
        this.lightMetalTexture.wrapT = THREE.MirroredRepeatWrapping;
        this.lightMetalTexture.repeat.set(2,  2);
        this.materialLightMetal = new THREE.MeshPhongMaterial({
            specular: 0xffffff, 
            shininess: 100,      
            reflectivity: 0.8,  
            map: this.lightMetalTexture
        });

        // television material
        this.televisionMaterial = new THREE.MeshPhongMaterial({ color: "#000000", 
            specular: "#ffffff", emissive: "#000000", shininess: 100, reflectivity: 0 });
        this.televisionFrameMaterial = new THREE.MeshPhongMaterial({ color: "#000000", 
            specular: "#000000", emissive: "#000000", shininess: 0, reflectivity:0 });
        
        // light wood material
        this.lightWoodTexture =new THREE.TextureLoader().load("Textures/floor1.jpg");
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 100;
        this.lightWoodMaterial = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.lightWoodTexture });
        this.lightMetalTextureHead =new THREE.TextureLoader().load("Textures/metal.jpg");
        this.lightMetalTextureHead.wrapS = THREE.MirroredRepeatWrapping;
        this.lightMetalTextureHead.wrapT = THREE.MirroredRepeatWrapping;
        this.lightMetalTextureHead.rotation = Math.PI/2;
        this.lightMetalTextureHead.repeat.set(2,  2);
        this.materialLightMetalHead = new THREE.MeshPhongMaterial({
            specular: 0xffffff, 
            shininess: 100,      
            reflectivity: 0.8,  
            map: this.lightMetalTextureHead
        });

        // oak wood material
        this.oakTexture =new THREE.TextureLoader().load("Textures/top.jpg");
        this.materialOakWood = new THREE.MeshPhongMaterial({ color: "#FFFFFF", 
            specular: "#777777", emissive: "#000000", shininess: 40, map: this.oakTexture });
        
        // white wood material
        this.whiteWoodTexture =new THREE.TextureLoader().load("Textures/tableLegs.jpg");
        this.materialWhiteWood = new THREE.MeshPhongMaterial({ color: "#FFFFFF", 
            specular: 0, emissive: "#000000", shininess: 25, map: this.whiteWoodTexture });

        // white wood used for tableLegs
        this.materialTableLegs = new THREE.MeshPhongMaterial({ color: "#FFFFFF", emissive: "#000000", map: this.whiteWoodTexture });

    }

    getPaintingTexture(paitingTexturePath){
        const paitingTexture =new THREE.TextureLoader().load(paitingTexturePath);
        const diffusePlaneColor = "#FFFFFF";
        const specularPlaneColor = "#777777";
        const planeShininess = 100;
        const paitingMaterial = new THREE.MeshPhongMaterial({ color: diffusePlaneColor, 
            specular: specularPlaneColor, emissive: "#000000", shininess: planeShininess, map:paitingTexture });

        return paitingMaterial
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
        let planeTexture =this.planeTexture
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
        this.floor.receiveShadow = true;
        this.floor.rotation.x = -Math.PI / 2;
        this.floor.position.y = 0;
        this.floor.position.z = 15 / 3 + 2.5;
        
        this.app.scene.add(this.floor);
    }



    buildSpotlightCake(){
        this.spotlight = new THREE.SpotLight(this.lightColor, this.lightIntensity, this.lightDistance, 
            this.lightAngle*(Math.PI/180), this.lightPenumbra, this.lightDecay);
        this.spotlight.castShadow = true;
        this.spotlight.shadow.mapSize.width = this.mapSize;
        this.spotlight.shadow.mapSize.height = this.mapSize;
        this.spotlight.shadow.camera.near = 0.5;
        this.spotlight.shadow.camera.far = 25;
        this.spotlight.shadow.bias = this.bias;

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
        this.addPointLight()

        // add an ambient light
        const ambientLight = new THREE.AmbientLight( 0xeeeeee, 0.05 );
        this.app.scene.add( ambientLight );


        this.buildCake()
        this.buildFloor()
        this.buildSpotlightCake()

        if(this.house === null){      
            this.house = new  MyHouse(this);
            this.app.scene.add(this.house);
        }

        this.table = new MyTable(this, 6,3.5,1.95,this.materialOakWood, this.materialTableLegs, [0, 0, 0], false, true);
        this.app.scene.add(this.table); 

        this.carpet = new MyCarpet(this,0x8eb1c2, [0, 0, 0]);
        this.app.scene.add(this.carpet); 

        //  books on bookshelf next to TV
        for (let i = 0; i < 4; i++) {
            const book = new MyBook(this, 1, 0.7, 0.2, 8, [0, 0, 0]);
            book.position.set(-7.9, 5.6 + i * 1.2, -13.8);
            book.rotateZ(Math.PI/2);
            book.rotateX(Math.PI);
            this.app.scene.add(book);
        }


        this.robot = new MyRobot(this, 0x8ecccc, [-4, -0.3, 3.9], true);
        this.app.scene.add(this.robot); 
        
        this.vase = new MyVase(this, 1, 0xc8dfea, [-12.5, 0, -13], true);
        this.app.scene.add(this.vase);

        this.lampshade = new MyLampshade(this, 7, 1.75, 1.5, this.materialLightMetal, 0xffffff, [12, 0, -12]);
        this.app.scene.add(this.lampshade);
        this.addSpotLightLamp(0xf8f9EB,  1, 30,[12, 7.5, -12], [12, 0, -12], 40, 1, 0)
        this.addSpotLightLamp(0xf8f9eb,  1, 30, [12, 7.5, -12], [12, 15, -12], 60, 1, 0)

        this.cakePiece = new MyCakePiece(this, 0xffdbe9, [1.2, 2.42, 6.8], true);
        this.app.scene.add(this.cakePiece);
        
        this.sofa1 = new MySofa(this, 1, 0x365563, 0x446879, [0,0, 9], 10, true );
        this.app.scene.add(this.sofa1);

        this.sofa2 = new MySofa(this, 1, 0X365563, 0x446879, [0,0, 0], 5, true );
        this.sofa2.rotation.y = -Math.PI/2;
        this.sofa2.position.x = -9;
        this.app.scene.add(this.sofa2);

        // Pile of plates
        for(let i = 0; i < 4; i++){
            let plate = new MyPlate(this, 0.5, 0xf5e9dc, [-2, 2, 0], true);
            plate.position.y += i*plate.plateHeight();
            this.app.scene.add(plate);
        }

        // Painting frames on the wall
        const flowerPaintingMaterial = this.getPaintingTexture("Textures/flowersPainting.jpg");
        this.flowersPainting = new MyFrame(this, 0.5,4, 4, [3.2, 6, 30-0.25],0, flowerPaintingMaterial, this.lightWoodMaterial, false);
        this.app.scene.add(this.flowersPainting);

        const housePaintingMaterial = this.getPaintingTexture("Textures/housePainting.jpg");
        this.housePainting = new MyFrame(this, 0.5,4, 4, [-3.2, 5.3, 30-0.25],0, housePaintingMaterial,this.lightWoodMaterial, false);
        this.app.scene.add(this.housePainting);

        this.window = new MyWindow(this, "Textures/transferir.jpg", "Textures/metal.jpg", true);
        this.app.scene.add(this.window);

        //televison
        this.television= new MyFrame(this, 0.3,10, 5, [0, 5, -15+0.25], Math.PI, this.televisionMaterial, this.televisionFrameMaterial);
        this.app.scene.add(this.television);

        // televison Bottom cabinet
        this.televisionBottomCabinet = new MyCabinet(this, 16, 2, 3, this.materialOakWood, this.materialWhiteWood, [-2,0, -14], false, 0);
        this.app.scene.add(this.televisionBottomCabinet);

        //bookshelf cabinet
        this.bookshelf = new MyCabinet(this, 4, 2, 5, this.materialOakWood, this.materialWhiteWood, [-8,5, -14], true, 3 );
        this.app.scene.add(this.bookshelf);

         //bookshelf cabinet
         this.bookshelf2 = new MyCabinet(this, 8, 2, 10, this.materialOakWood, this.materialWhiteWood, [0,2, -14], true,4);
         this.bookshelf2.rotateY(-Math.PI/2)
         this.app.scene.add(this.bookshelf2);

        // books on bookshelf next to the door
        for (let i = 0; i < 5; i++) {
            this.book2  =  new MyBook(this, 1, 1.2, 0.3, 10, [0, 0, 0]);
            this.book2.position.set(14.1, 3.1 +  i*1.9, 0.25);
            this.book2.rotateZ(Math.PI/2);
            this.book2.rotateX(Math.PI/2);
            this.app.scene.add(this.book2);
        }


        //back table
        this.backTable = new MyTable(this, 12, 5,4, this.materialOakWood, this.materialTableLegs, [0, 0, 10.5], true, true);
        this.app.scene.add(this.backTable); 

        // door
        this.door = new MyDoor(this, 5, 12,0.5, this.materialOakWood, this.materialLightMetal, [7.4, 0, 8]);
        this.app.scene.add(this.door); 

        this.lampshadeCeiling1 = new MyLampshade(this, 0.7, 0.6, 0.5, "Textures/metal.jpg", 0xffffff, [0, 15, 0],0, true);
        this.app.scene.add(this.lampshadeCeiling1);

        this.lampshadeCeiling2 = new MyLampshade(this, 0.7, 0.6, 0.5, "Textures/metal.jpg", 0xffffff, [0, 15, 18], 0, true);
        this.app.scene.add(this.lampshadeCeiling2);
        this.addSpotLightLamp(0xffffff, 2, 40, [0, 15, 18], [0, 0, 21], 70,1, 0, true)

        this.carocha = new MyCarocha(this, this.lightWoodMaterial, [14.75, 6, 22], -Math.PI/2, 1);
        this.app.scene.add(this.carocha);

        //coil
        this.coil = new MyCoil(this, 0.5, 8, 0.07, [2, 4.6, 21], Math.PI/4, true);
        this.app.scene.add(this.coil);

        this.roundVase= new MyRoundVase(this, 0.8, 0xc8dfea, [0, 6, 21], true);
        this.app.scene.add(this.roundVase);

        this.flower = new MyFlower(this, 2, 0xffb6c1, [0, 5.4, 21], Math.PI , true);
        this.app.scene.add(this.flower);

        this.jornal= new MyJornal(this, 1, [-10, 1.44, -1], Math.PI/20, 4, 0.5, true);
        this.app.scene.add(this.jornal);

    }

    addSpotLightLamp(lightColor, intensity, distance, lampPosition,targetPostion, lightAngle, penumbra, decay, shadows=false){
        let spotlightLamp = new THREE.SpotLight(lightColor, intensity, distance, lightAngle*(Math.PI/180), penumbra, decay);
        if(shadows){
            spotlightLamp.castShadow = true;
            spotlightLamp.shadow.mapSize.width = this.mapSize;
            spotlightLamp.shadow.mapSize.height = this.mapSize;
            spotlightLamp.shadow.camera.near = 0.5;
            spotlightLamp.shadow.camera.far = 45;
            spotlightLamp.shadow.bias = this.bias;
        }
        spotlightLamp.position.set(lampPosition[0], lampPosition[1], lampPosition[2]);
        let target = new THREE.Object3D();
        target.position.set(targetPostion[0], targetPostion[1], targetPostion[2]);
        this.app.scene.add(target);
        spotlightLamp.target = target;
        this.app.scene.add(spotlightLamp);

        //let spotLightLampHelper = new THREE.SpotLightHelper(spotlightLamp);
        //this.app.scene.add(spotLightLampHelper);
    }

    addPointLight(){
        // add a point light on top of the model
        const pointLight = new THREE.PointLight( 0xffffff, 70, 0);
        /*pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = this.mapSize;
        pointLight.shadow.mapSize.height = this.mapSize;
        pointLight.shadow.camera.near = 0.5;
        pointLight.shadow.camera.far = 25;
        pointLight.shadow.bias = this.bias;*/
        pointLight.position.set( 0, 14.5, 7.5 );
        this.app.scene.add( pointLight );
        const pontLightObject = new THREE.CylinderGeometry( 0.5, 0.5, 0.3, 32 );
        const pontLightMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff, emissive: 0xdddddd} );
        const pointLightObject = new THREE.Mesh( pontLightObject, pontLightMaterial );
        pointLightObject.position.set( 0, 14.7, 7.5 );
        this.app.scene.add( pointLightObject );

        const pointLightBase = new THREE.CylinderGeometry( 1, 0.5, 0.4, 32 );
        const pointLightBaseMaterial = new THREE.MeshPhongMaterial( {color: 0x000000, emissive: 0x222222} );
        const pointLightBaseObject = new THREE.Mesh( pointLightBase, pointLightBaseMaterial );
        pointLightBaseObject.position.set( 0, 14.8, 7.5 );
        this.app.scene.add( pointLightBaseObject );
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
    

    rebuildFloor(){
        this.buildFloor();
        if(this.floor !== undefined && this.floor !== null){
            this.app.scene.remove(this.floor);
        }
    }

    rebuildFloorWrapping(){
        this.planeTexture =new THREE.TextureLoader().load(this.planetexturePath);
        this.rebuildFloor();
    }

    rebuildSpotlight(){
        if(this.spotlight !== undefined && this.spotlight !== null){
            this.app.scene.remove(this.spotlight);
            this.app.scene.remove(this.targetSpot);
            //this.app.scene.remove(this.spotLightHelper);
        }
        this.buildSpotlightCake();
    }
    

    /**
     * updates the contents
     * this method is called from the render method of the app
     * 
     */
    update() {
    }

}

export { MyContents };