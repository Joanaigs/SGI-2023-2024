
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MyContents } from './MyContents.js';
import { MyGuiInterface } from './MyGuiInterface.js';
import { MyScene } from './classes/MyScene.js';
import Stats from 'three/addons/libs/stats.module.js'

/**
 * This class contains the application object
 */
class MyApp {
    /**
     * the constructor
     */
    constructor() {
        this.scene = null
        this.stats = null
        this.showBoundingBoxes = false

        // camera related attributes
        this.activeCamera = null
        this.activeCameraName = null
        this.lastCameraName = null
        this.cameras = []
        this.camerasNames = []
        this.frustumSize = 20

        // other attributes
        this.renderer = null
        this.controls = null
        this.gui = null
        this.axis = null
        this.contents == null
    }

    // Capture RGB image from the active camera
    captureRGBImage() {
        const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.app.renderer.setRenderTarget(renderTarget);
        this.app.renderer.render(this.app.scene, this.app.activeCamera);
        const imageData = this.readRenderTarget(renderTarget);
        this.app.renderer.setRenderTarget(null); // Reset render target
        return imageData;
    }

    // Capture LGray image from the depth buffer of the active camera
    captureLGrayImage() {
        const renderTarget = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
        this.app.renderer.setRenderTarget(renderTarget);
        this.app.renderer.render(this.app.scene, this.app.activeCamera);
        const depthBuffer = this.readDepthBuffer(renderTarget);
        const lGrayImageData = this.convertDepthToLGray(depthBuffer);
        this.app.renderer.setRenderTarget(null); // Reset render target
        //save image

        return lGrayImageData;
    }

    // Helper function to read the render target pixels
    readRenderTarget(renderTarget) {
        const pixelBuffer = new Uint8Array(window.innerWidth * window.innerHeight * 4);
        this.app.renderer.readRenderTargetPixels(renderTarget, 0, 0, window.innerWidth, window.innerHeight, pixelBuffer);
        return pixelBuffer;
    }

    // Helper function to read the depth buffer
    readDepthBuffer(renderTarget) {
        const depthBuffer = new Float32Array(window.innerWidth * window.innerHeight);
        this.app.renderer.readRenderTargetPixels(renderTarget, 0, 0, window.innerWidth, window.innerHeight, depthBuffer);
        return depthBuffer;
    }

    // Helper function to convert depth buffer to LGray image
    convertDepthToLGray(depthBuffer) {
        // You need to implement the conversion logic based on your requirements
        // This is a simple example, and you may need to adjust it according to your needs
        const lGrayBuffer = new Uint8Array(depthBuffer.length);
        for (let i = 0; i < depthBuffer.length; i++) {
            const normalizedDepth = (depthBuffer[i] - this.app.activeCamera.near) / (this.app.activeCamera.far - this.app.activeCamera.near);
            const lGrayValue = normalizedDepth * 255;
            lGrayBuffer[i] = lGrayValue;
        }
        return lGrayBuffer;
    }


    /**
     * initializes the application
     */
    init() {

        // Create an empty scene
        this.scene = new MyScene(this);

        this.stats = new Stats()
        this.stats.showPanel(1) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom)

        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor("#000000");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Configure renderer size
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append Renderer to DOM
        document.getElementById("canvas").appendChild(this.renderer.domElement);

        // manage window resizes
        window.addEventListener('resize', this.onResize.bind(this), false);
    }

    /**
     * Initializes the scene cameras
     * @param {List} cameras the cameras object
     * @param {String} activeCameraId the id of the active camera
     * 
     */
    initCameras(cameras, activeCameraId) {
        this.cameras = [];
        this.cameraTarget = {};
        const aspect = window.innerWidth / window.innerHeight;
        for (let camera in cameras) {
            this.camerasNames.push(cameras[camera].id);
            switch (cameras[camera].type) {
                case "perspective":
                    let cameraTemp1 = new THREE.PerspectiveCamera(cameras[camera].angle * 180 / Math.PI, aspect, cameras[camera].near, cameras[camera].far);
                    cameraTemp1.position.set(cameras[camera].location[0], cameras[camera].location[1], cameras[camera].location[2]);
                    cameraTemp1.lookAt(new THREE.Vector3(cameras[camera].target[0], cameras[camera].target[1], cameras[camera].target[2]));
                    this.cameraTarget[cameras[camera].id] = new THREE.Vector3(cameras[camera].target[0], cameras[camera].target[1], cameras[camera].target[2]);
                    this.cameras[cameras[camera].id] = cameraTemp1;
                    this.scene.add(cameraTemp1);
                    break;
                case "orthogonal":
                    let cameraTemp2 = new THREE.OrthographicCamera(cameras[camera].left * aspect, cameras[camera].right * aspect, cameras[camera].top, cameras[camera].bottom, cameras[camera].near, cameras[camera].far);
                    cameraTemp2.position.set(cameras[camera].location[0], cameras[camera].location[1], cameras[camera].location[2]);
                    cameraTemp2.lookAt(new THREE.Vector3(cameras[camera].target[0], cameras[camera].target[1], cameras[camera].target[2]));
                    this.cameraTarget[cameras[camera].id] = new THREE.Vector3(cameras[camera].target[0], cameras[camera].target[1], cameras[camera].target[2]);
                    this.cameras[cameras[camera].id] = cameraTemp2;
                    this.scene.add(cameraTemp2);
                    break;
            }
        }
        this.setActiveCamera(activeCameraId);
    }

    /**
     * updates the target of the active camera
     */
    updateTarget() {
        // for in the camera positions
        for (let camera in this.cameraTarget) {
            // if the camera is the active camera
            if (camera === this.activeCameraName) {
                // update the camera target
                this.controls.target = this.cameraTarget[camera]
            }
        }
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
                this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
                this.controls.enableZoom = true;
                this.updateTarget();
                this.controls.update();

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
            this.renderer.setSize(window.innerWidth, window.innerHeight);
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
    render() {
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
        requestAnimationFrame(this.render.bind(this));

        this.lastCameraName = this.activeCameraName
        this.stats.end()
    }
}


export { MyApp };