import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     * 
     * @param {MyApp} app The application object 
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects 
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // add a folder to the gui interface for the box
        const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object 
        boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open()
        
        const data = {  
            'diffuse color': this.contents.diffusePlaneColor,
            'specular color': this.contents.specularPlaneColor,
        };

        // adds a folder to the gui interface for the plane
        const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();

        // adds a folder to the gui interface for the textures
        const textureFolder = this.datgui.addFolder( 'Textures Plane Settings' );
        const wrappingModeOptions = ['ClampToEdge', 'Repeat', 'MirroredRepeat'];
        textureFolder.add(this.contents, 'wrapping_mode_u', wrappingModeOptions).name('Wrapping U').onChange( (value) => { this.contents.rebuildFloor() } );
        textureFolder.add(this.contents, 'wrapping_mode_v', wrappingModeOptions).name('Wrapping V').onChange( (value) => { this.contents.rebuildFloor() } );
        textureFolder.add(this.contents, 'repeat_u', 1, 10).name('Repeat U').onChange((value) => { this.contents.rebuildFloor() });
        textureFolder.add(this.contents, 'repeat_v', 1, 10).name('Repeat V').onChange((value) => { this.contents.rebuildFloor() });
        textureFolder.add(this.contents, 'offset_u', 0, 1).name('Offset U').onChange((value) => { this.contents.rebuildFloor() });
        textureFolder.add(this.contents, 'offset_v', 0, 1).name('Offset V').onChange((value) => { this.contents.rebuildFloor() });
        textureFolder.add(this.contents, 'rotation', 0, 360).name('Rotation').onChange((value) => { this.contents.rebuildFloor() });


        const lightFolder = this.datgui.addFolder( 'SpotLight cake' );
        lightFolder.addColor( this.contents, 'lightColor' ).onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents, 'lightIntensity', 0, 20).name("Intensity").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents, 'lightDistance', 0, 100).name("Distance").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents, 'lightAngle', 0, 90).name("Angle").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents, 'lightPenumbra', 0, 1).name("Penumbra").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents, 'lightDecay', 0, 1).name("Decay").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents.lightPosition, 'x', -5, 20).name("Position X").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents.lightPosition, 'y', -5, 20).name("Position Y").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents.lightPosition, 'z', -5, 20).name("Position Z").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents.lightTarget, 'x', -5, 20).name("Target X").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents.lightTarget, 'y', -5, 20).name("Target Y").onChange( (value) => { this.contents.rebuildSpotlight() } );
        lightFolder.add(this.contents.lightTarget, 'z', -5, 20).name("Target Z").onChange( (value) => { this.contents.rebuildSpotlight() } );





        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Robot','Jornal','Vase', 'Left Side Room Prepective', 'Left','Right', 'Top', 'Front', 'Back' ] ).name("active camera");
        // note that we are using a property from the app 
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()
    }
}

export { MyGuiInterface };