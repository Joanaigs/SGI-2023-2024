import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';

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

        // box related attributes
        this.boxMesh = null
        this.boxMeshSize = 1.0
        this.boxEnabled = true
        this.lastBoxEnabled = null
        this.boxDisplacement = new THREE.Vector3(0, 2, 0)

        // plane related attributes
        //texture
        this.planeTexture =
            new THREE.TextureLoader().load('textures/feup_b.jpg');
        this.planeTexture.wrapS = THREE.RepeatWrapping;
        this.planeTexture.wrapT = THREE.RepeatWrapping;
        // material
        this.diffusePlaneColor = "rgb(128,128,128)"
        this.specularPlaneColor = "rgb(0,0,0)"
        this.planeShininess = 0
        // relating texture and material:
        // two alternatives with different results
        // alternative 1
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.specularPlaneColor,
            emissive: "#000000", shininess: this.planeShininess,
            map: this.planeTexture
        })
        // end of alternative 1
        // alternative 2
        // this.planeMaterial = new THREE.MeshLambertMaterial({
        //        map : this.planeTexture });
        // end of alternative 2
        let plane = new THREE.PlaneGeometry(10, 10);

        //spotlight
        this.lightColor = "#ffffff";
        this.lightIntensity = 2;
        this.lightDistance = 40;
        this.lightAngle = 70;
        this.lightPenumbra = 1;
        this.lightDecay = 0;
        this.lightPosition = new THREE.Vector3(0, 15, 0);
        this.lightTarget = new THREE.Vector3(0, 2, -3);

        // plane related attributes
        this.wrapping_mode_u = 'Repeat';
        this.wrapping_mode_v = 'Repeat';
        this.planeSizeU = 10;
        this.planeSizeV = 7;
        let planeUVRate = this.planeSizeV / this.planeSizeU;
        let planeTextureUVRate = 3354 / 2385; // image dimensions
        this.repeat_u = 1;
        this.repeat_v = this.repeat_u * planeUVRate * planeTextureUVRate;
        this.offset_u = 0;
        this.offset_v = 0;
        this.rotation = 0;
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 50;
        this.planeMaterial = new THREE.MeshPhongMaterial({
            color: this.diffusePlaneColor,
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess,
        });


    }

    buildPlane(){
        let planeTexture =new THREE.TextureLoader().load('textures/feup_b.jpg');
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
        var plane = new THREE.PlaneGeometry( this.planeSizeU, this.planeSizeV );

        this.planeMesh = new THREE.Mesh( plane, this.planeMaterial );

        this.planeMesh.rotation.x = -Math.PI / 2;

        this.planeMesh.position.y = 0;

        this.app.scene.add( this.planeMesh );

    }


    buildSpotlight() {
        this.spotlight = new THREE.SpotLight(this.lightColor, this.lightIntensity, this.lightDistance,
            this.lightAngle * (Math.PI / 180), this.lightPenumbra, this.lightDecay);
        this.spotlight.castShadow = true;
        this.spotlight.shadow.mapSize.width = this.mapSize;
        this.spotlight.shadow.mapSize.height = this.mapSize;
        this.spotlight.shadow.camera.near = 0.5;
        this.spotlight.shadow.camera.far = 25;
        this.spotlight.shadow.bias = -0.0003;

        this.spotlight.position.set(this.lightPosition.x, this.lightPosition.y, this.lightPosition.z);
        this.targetSpot = new THREE.Object3D();
        this.targetSpot.position.set(this.lightTarget.x, this.lightTarget.y, this.lightTarget.z);
        this.app.scene.add(this.targetSpot);
        this.spotlight.target = this.targetSpot;
        this.app.scene.add(this.spotlight);
        //this.spotLightHelper = new THREE.SpotLightHelper(this.spotlight, 0xffffff );
        //this.app.scene.add(this.spotLightHelper)
    }


    /**
     * builds the box mesh with material assigned
     */
    buildBox() {

        let texture = new THREE.TextureLoader().load('textures/feup_entry.jpg');
        let boxMaterial = new THREE.MeshPhongMaterial({
            color: "#ffff77",
            specular: "#000000", emissive: "#000000", shininess: 90, map: texture
        })

        // Create a Cube Mesh with basic material
        let box = new THREE.BoxGeometry(this.boxMeshSize, this.boxMeshSize, this.boxMeshSize);
        this.boxMesh = new THREE.Mesh(box, boxMaterial);
        this.boxMesh.rotation.x = -Math.PI / 2;
        this.boxMesh.position.y = this.boxDisplacement.y;
    }

    rebuildFloor(){
        if(this.floor !== undefined && this.floor !== null){
            this.app.scene.remove(this.floor);
        }
        this.buildPlane();
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
        const pointLight = new THREE.PointLight(0xffffff, 5, 0, 0);
        pointLight.position.set(0, 20, 0);
        //this.app.scene.add( pointLight );

        // directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, -10, -2);
        //this.app.scene.add( directionalLight );


        // add a point light helper for the previous point light
        const sphereSize = 0.5;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        this.app.scene.add(pointLightHelper);

        // add an ambient light
        const ambientLight = new THREE.AmbientLight(0x555555);
        this.app.scene.add(ambientLight);

        this.buildBox()
        this.buildSpotlight()
        this.buildPlane()


        //circle
        /*let circle = new THREE.CircleGeometry(1, 32);
        this.circleMesh = new THREE.Mesh(circle, this.planeMaterial);
        this.circleMesh.position.set(2, 1, 0);
        this.app.scene.add(this.circleMesh);
        //sphere
        let sphere = new THREE.SphereGeometry(1, 32, 32);
        this.sphereMesh = new THREE.Mesh(sphere, this.planeMaterial);
        this.sphereMesh.position.set(-4, 1, 0);
        this.app.scene.add(this.sphereMesh);

        //partial sphere
        let partialSphere = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI / 2, 0, Math.PI / 2);
        this.partialSphereMesh = new THREE.Mesh(partialSphere, this.planeMaterial);
        this.partialSphereMesh.position.set(-4, 1, 4);
        this.app.scene.add(this.partialSphereMesh);

        //cylinder
        let cylinder = new THREE.CylinderGeometry(1, 1, 2, 32);
        this.cylinderMesh = new THREE.Mesh(cylinder, this.planeMaterial);
        this.cylinderMesh.position.set(2, 1, 4);
        this.app.scene.add(this.cylinderMesh);

        //partial cylinder
        let partialCylinder = new THREE.CylinderGeometry(1, 1, 2, 32, 0, Math.PI / 2, 0, Math.PI / 2);
        this.partialCylinderMesh = new THREE.Mesh(partialCylinder, this.planeMaterial);
        this.partialCylinderMesh.position.set(2, 1, 0);
        this.app.scene.add(this.partialCylinderMesh);

        //cone
        let cone = new THREE.ConeGeometry(1, 2, 32);
        this.coneMesh = new THREE.Mesh(cone, this.planeMaterial);
        this.coneMesh.position.set(-4, 1, -4);
        this.app.scene.add(this.coneMesh);

        //polyhedron
        const verticesOfCube = [
            -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
            -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
        ];

        const indicesOfFaces = [
            2, 1, 0, 0, 3, 2,
            0, 4, 7, 7, 3, 0,
            0, 1, 5, 5, 4, 0,
            1, 2, 6, 6, 5, 1,
            2, 3, 7, 7, 6, 2,
            4, 5, 6, 6, 7, 4
        ];

        const geometry = new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 6, 2);
        this.polyhedronMesh = new THREE.Mesh(geometry, this.planeMaterial);
        this.polyhedronMesh.position.set(2, 1, -4);
        this.polyhedronMesh.scale.set(0.2, 0.2, 0.2);
        this.app.scene.add(this.polyhedronMesh);*/


    }

    rebuildSpotlight() {
        if (this.spotlight !== undefined && this.spotlight !== null) {
            this.app.scene.remove(this.spotlight);
            this.app.scene.remove(this.targetSpot);
            //this.app.scene.remove(this.spotLightHelper);
        }
        this.buildSpotlight();
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