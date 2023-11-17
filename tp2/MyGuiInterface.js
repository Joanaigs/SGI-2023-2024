import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { MyApp } from "./MyApp.js";
import { MyContents } from "./MyContents.js";

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface {
  /**
   *
   * @param {MyApp} app The application object
   */
  constructor(app) {
    this.app = app;
    this.datgui = new GUI();
    this.contents = null;
  }

  /**
   * Set the contents object
   * @param {MyContents} contents the contents objects
   */
  setContents(contents) {
    this.contents = contents;
  }

  /**
   * Initialize the gui interface
   */
  init() {
    // adds a folder to the gui interface for the camera
    const cameraFolder = this.datgui.addFolder("Camera");
    cameraFolder.add(this.app, "activeCameraName", this.app.camerasNames).name("active camera");
    cameraFolder.open();

    const santaFolder = this.datgui.addFolder("Santa");
    santaFolder.add(this.contents, 'santaPos', 0, 3).name("Santa Going up the chimine").onChange((value) => { this.contents.updateSantaPosition(value) });


    const lightFolder = this.datgui.addFolder('Lights');
    for( let key of this.contents.lights.keys()){
      lightFolder.add(this.contents.lightEnabled, key).onChange(() => { this.contents.updateLights(key)});

    }
    lightFolder.open();

    //wireframe
    const wireframeFolder = this.datgui.addFolder('Wireframe');
    wireframeFolder.add(this.contents, "wireframe").onChange(() => { this.contents.updateWireframe()});
  }
}

export { MyGuiInterface };
