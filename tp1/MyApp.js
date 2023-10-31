
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp  {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.frustumSize = 23
        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null
    }
    /**
     * initializes the application
     */
    init() {
                
        // Create an empty scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x101010 );

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        this.initCameras();
        this.setActiveCamera('Perspective')

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

        // Configure renderer size
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild( this.renderer.domElement );

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false );
    }

    /**
     * initializes all the cameras
     */
    initCameras() {
        const aspect = window.innerWidth / window.innerHeight;

        // Create a basic perspective camera
        const perspective1 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective1.position.set(10,8,25) //10,, 10, 3
        this.cameras['Perspective'] = perspective1

        // Create a basic perspective camera
        const perspective2 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective2.position.set(0,5,0)
        this.cameras['Robot'] = perspective2

        // Jornal Prespective Camera
        const perspective3 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective3.position.set(-5, 5, -1)
        this.cameras['Jornal'] = perspective3

        //Cake Prespective Camera
        const perspectiveCake = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspectiveCake.position.set(0, 5, 7)
        this.cameras['Cake'] = perspectiveCake

        // Vase Prespective Camera
        const perspectiveVase = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspectiveVase.position.set(0, 5, 17)
        this.cameras['Round Vase'] = perspectiveVase

        // Coil Prespective Camera
        const perspectiveCoil = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspectiveCoil.position.set(2, 5, 18)
        this.cameras['Coil'] = perspectiveCoil

        // Photo Frame Prespective Camera
        const perspectivePhotoFrame = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspectivePhotoFrame.position.set(0, 8, 22)
        this.cameras['Photo Frames'] = perspectivePhotoFrame

        // Carocha Prespective Camera
        const perspectiveCarocha = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspectiveCarocha.position.set(10, 8, 25)
        this.cameras['Carocha'] = perspectiveCarocha

        //Vase Prespective Camera
        const perspective4 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective4.position.set(-8, 3, -8)
        this.cameras['Vase Cylinder'] = perspective4

        //Left Side Room Prepective
        const perspective5 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective5.position.set(0, 7, 10)
        this.cameras['Dining Side Prepective'] = perspective5

        // Right Side Room Prespective
        const perspective6 = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 )
        perspective6.position.set(0, 7, 10)
        this.cameras['Television Side Prepective'] = perspective6

        // defines the frustum size for the orthographic cameras
        let left = -(this.frustumSize) / 2 * aspect -7.5
        let right = (this.frustumSize) /2 * aspect -7.5
        let top = this.frustumSize / 2 + 7.5
        let bottom = -this.frustumSize / 2 +7.5
        let near = -this.frustumSize /2
        let far =  this.frustumSize

        // create a left view orthographic camera
        const orthoLeft = new THREE.OrthographicCamera( left +15, right+15, top, bottom, -15, far);
        orthoLeft.up = new THREE.Vector3(0,1,0);
        orthoLeft.position.set(-this.frustumSize /4,0,0) 
        orthoLeft.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Left'] = orthoLeft

        // create a left view orthographic camera
        console.log(left, right, top, bottom, near, far)
        const orthoRight = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoRight.up = new THREE.Vector3(0,1,0);
        orthoRight.position.set(this.frustumSize /4,0,0) 
        orthoRight.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Right'] = orthoRight

        this.frustumSize = 45

        // defines the frustum size for the orthographic cameras
        left = -(this.frustumSize) / 2 * aspect
        right = (this.frustumSize) /2 * aspect 
        top = this.frustumSize / 2 +7.5
        bottom = -this.frustumSize / 2+7.5 
        near = -this.frustumSize /2
        far =  this.frustumSize

        // create a top view orthographic camera
        const orthoTop = new THREE.OrthographicCamera( left, right, top, bottom, near, far);
        orthoTop.up = new THREE.Vector3(0,0,1);
        orthoTop.position.set(0, this.frustumSize /4, 0) 
        orthoTop.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Top'] = orthoTop

        this.frustumSize = 15

        // defines the frustum size for the orthographic cameras
        left = -(this.frustumSize) / 2 * aspect
        right = (this.frustumSize) /2 * aspect 
        top = this.frustumSize / 2 +7.5
        bottom = -this.frustumSize / 2+7.5 
        near = -this.frustumSize /2
        far =  this.frustumSize

        // create a front view orthographic camera
        const orthoFront = new THREE.OrthographicCamera( left, right, top, bottom, near, far+40);
        orthoFront.up = new THREE.Vector3(0,1,0);
        orthoFront.position.set(0,0, this.frustumSize /4) 
        orthoFront.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Front'] = orthoFront

        // create a back view orthographic camera
        const orthoBack = new THREE.OrthographicCamera( left, right, top, bottom, near, far+40);
        orthoBack.up = new THREE.Vector3(0,1,0);
        orthoBack.position.set(0,0, -this.frustumSize /4)
        orthoBack.lookAt( new THREE.Vector3(0,0,0) );
        this.cameras['Back'] = orthoBack

    }

    /**
     * sets the active camera by name
     * @param {String} cameraName 
     */
    setActiveCamera(cameraName) {   
        this.activeCameraName = cameraName
        this.activeCamera = this.cameras[this.activeCameraName]
    }

    /**
     * updates the target of the active camera
     */
    updateTarget(){
        if(this.activeCameraName == 'Perspective' || this.activeCameraName == 'Top' || this.activeCameraName == 'Front' || this.activeCameraName == 'Back' || this.activeCameraName == 'Right' || this.activeCameraName == 'Left'){
            this.controls.target = new THREE.Vector3(0, 0, 0)
        }
        else if(this.activeCameraName == 'Robot'){
            this.controls.target = new THREE.Vector3(2, 3, 10)
        }
        else if(this.activeCameraName == 'Cake'){
            this.controls.target = new THREE.Vector3(0, 2, 0)
        }
        else if(this.activeCameraName == 'Jornal'){
            this.controls.target = new THREE.Vector3(-10, 1.4, -1)
        }
        else if(this.activeCameraName == 'Round Vase'){
            this.controls.target = new THREE.Vector3(0, 5, 21)
        }
        else if(this.activeCameraName == 'Vase Cylinder'){
            this.controls.target = new THREE.Vector3(-12.5, 2, -13)
        }
        else if(this.activeCameraName == 'Photo Frames'){
            this.controls.target = new THREE.Vector3(0, 8, 30)
        }
        else if(this.activeCameraName == 'Coil'){
            this.controls.target = new THREE.Vector3(2, 5, 21)
        }
        else if(this.activeCameraName == 'Carocha'){
            this.controls.target = new THREE.Vector3(15, 8, 25)
        }
        else if(this.activeCameraName == 'Dining Side Prepective'){
            this.controls.target = new THREE.Vector3(0, 5, 30)
        }
        else if(this.activeCameraName == 'Television Side Prepective'){
            this.controls.target = new THREE.Vector3(0, 5, -15)
        }

    }

    /**
     * updates the active camera if required
     * this function is called in the render loop
     * when the active camera name changes
     * it updates the active camera and the controls
     */
    updateCameraIfRequired() {

        // camera changed?
        if (this.lastCameraName !== this.activeCameraName) {
            this.lastCameraName = this.activeCameraName;
            this.activeCamera = this.cameras[this.activeCameraName]
            document.getElementById("camera").innerHTML = this.activeCameraName
           
            // call on resize to update the camera aspect ratio
            // among other things
            this.onResize()

            // are the controls yet?
            if (this.controls === null) {
                // Orbit controls allow the camera to orbit around a target.
                this.controls = new OrbitControls( this.activeCamera, this.renderer.domElement );
                this.controls.enableZoom = true;
                this.updateTarget();

                
            }
            else {
                this.controls.object = this.activeCamera
                this.updateTarget();
            }
        }
    }

    /**
     * the window resize handler
     */
    onResize() {
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.activeCamera.aspect = window.innerWidth / window.innerHeight;
            this.activeCamera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }
    /**
     * 
     * @param {MyContents} contents the contents object 
     */
    setContents(contents) {
        this.contents = contents;
    }

    /**
     * @param {MyGuiInterface} contents the gui interface object
     */
    setGui(gui) {   
        this.gui = gui
    }

    /**
    * the main render function. Called in a requestAnimationFrame loop
    */
    render () {
        this.stats.begin()
        this.updateCameraIfRequired()

        // update the animation if contents were provided
        if (this.activeCamera !== undefined && this.activeCamera !== null) {
            this.contents.update()
        }

        // required if controls.enableDamping or controls.autoRotate are set to true
        this.controls.update();

        // render the scene
        this.renderer.render(this.scene, this.activeCamera);

        // subsequent async calls to the render loop
        requestAnimationFrame( this.render.bind(this) );

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };