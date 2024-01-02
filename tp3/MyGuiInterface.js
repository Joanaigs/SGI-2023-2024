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
    this.datgui.close();
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
    cameraFolder.add(this.app, "activeCameraName", this.app.camerasNames).name("active camera").listen();

    // adds a folder to the gui interface for the axis
    const axisFolder = this.datgui.addFolder("Axis");
    axisFolder.add(this.contents, "axisVisible").onChange(() => {
      this.contents.updateAxis();
    });

    const boundingBoxFolder = this.datgui.addFolder("Bounding Boxes");
    boundingBoxFolder.add(this.app, "showBoundingBoxes");

  }

  updateGui() {
    // update the gui interface
  }


}

export { MyGuiInterface };
