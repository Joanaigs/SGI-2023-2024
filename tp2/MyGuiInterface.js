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

    const sockFolder = this.datgui.addFolder("Sock");
    const sockOptions = ['green', 'red'];
    sockFolder.add(this.contents, 'sockTexture', sockOptions).name("Change socks").onChange((value) => { this.contents.updateSockTexture(value) });


    const lightFolder = this.datgui.addFolder('Lights');
    const lightOptions = ['on', 'off', 'blinking'];
    lightFolder.add(this.contents, "lightTreeEnabled", lightOptions).onChange((key) => { this.contents.updateTreeLights(key)});

    for( let key of this.contents.lights.keys()){
      if(key.includes("lightTree")){
        continue;
      }
      else{
        lightFolder.add(this.contents.lightEnabled, key).onChange(() => { this.contents.updateLights(key)});
      }

    }
    lightFolder.open();

    const treeDedcorationFolder = this.datgui.addFolder('Tree Decoration');
    treeDedcorationFolder.addColor(this.contents, 'treeDecoration').onChange((value) => { this.contents.updateTreeDecorationValue(value) });
    this.treeDecorationRandomButton = treeDedcorationFolder.add(
      {
        toggleTreeDecorationRandom: () => {
          this.contents.updateTreeDecorationRandom();
        },
      },
      'toggleTreeDecorationRandom'
    ).name("Toggle Random");


    const cookiesFolder = this.datgui.addFolder('Food');
    cookiesFolder.add(this.contents, 'numcookies', 0, 4, 1).name("Number of cookies").onChange((value) => { this.contents.updateCookies(value) });
    cookiesFolder.add(this.contents, 'milkHeight', 0.01, 0.4).name("Drink Milk").onChange((value) => { this.contents.updateMilk(value) });

    const shaderFolder = this.datgui.addFolder('Shader');
    shaderFolder.add(this.contents, 'showShadows').name("Show Shadows").onChange(() => { this.contents.updateShadows() });


    //wireframe
    const wireframeFolder = this.datgui.addFolder('Wireframe');
    wireframeFolder.add(this.contents, "wireframe").onChange(() => { this.contents.updateWireframe()});

    const videoFolder = this.datgui.addFolder("Video Controls");

    videoFolder.add({
      playPauseVideo: () => {
        const video = document.getElementById("video");
        if (video.paused) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0; // Set video to start from the beginning
        }
      },
    }, "playPauseVideo").name("Turn the TV on/off");
  }
}

export { MyGuiInterface };
