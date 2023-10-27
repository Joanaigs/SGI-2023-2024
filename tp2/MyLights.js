import * as THREE from "three";
import { MyContents } from "./MyContents.js";

/**
 
This class creates lights*/
class MyLights {
  /**
   * @param {MyContents} content The contents object
   */
  constructor(content) {
    this.content = content;
  }
  createLight(lightData) {
    switch (lightData.type) {
      case "directionallight":
        let directionalLight = new THREE.DirectionalLight(
          lightData.color,
          lightData.intensity
        );
        directionalLight.position.set(
          lightData.position[0],
          lightData.position[1],
          lightData.position[2]
        );
        directionalLight.castShadow = lightData.castshadow;
        directionalLight.shadow.mapSize.width = lightData.shadowmap;
        directionalLight.shadow.mapSize.height = lightData.shadowmap;
        directionalLight.shadow.camera.far = lightData.shadowfar;
        directionalLight.shadow.camera.left = lightData.shadowleft;
        directionalLight.shadow.camera.right = lightData.shadowright;
        directionalLight.shadow.camera.top = lightData.shadowtop;
        directionalLight.shadow.camera.bottom = lightData.shadowbottom;
        this.lights.set(lightData.id, directionalLight);
        this.lightEnabled.set(lightData.id, lightData.enabled);

      case "pointlight":
        let pointLight = new THREE.PointLight(
          lightData.color,
          lightData.intensity,
          lightData.distance,
          lightData.decay
        );
        pointLight.position.set(
          lightData.position[0],
          lightData.position[1],
          lightData.position[2]
        );
        pointLight.castShadow = lightData.castshadow;
        pointLight.shadow.mapSize.width = lightData.shadowmap;
        pointLight.shadow.mapSize.height = lightData.shadowmap;
        pointLight.shadow.camera.far = lightData.shadowfar;
        let target2 = new THREE.Object3D();
        target2.position.set(
          lightData.target[0],
          lightData.target[1],
          lightData.target[2]
        );
        this.app.scene.add(target2);
        this.lights.set(lightData.id, pointLight);
        this.lightEnabled.set(lightData.id, lightData.enabled);

      case "spotlight":
        let spotLight = new THREE.SpotLight(
          lightData.color,
          lightData.intensity,
          lightData.distance,
          lightData.angle,
          lightData.penumbra,
          lightData.decay
        );
        spotLight.position.set(
          lightData.position[0],
          lightData.position[1],
          lightData.position[2]
        );
        let target = new THREE.Object3D();
        target.position.set(
          lightData.target[0],
          lightData.target[1],
          lightData.target[2]
        );
        this.app.scene.add(target);
        spotLight.target = target;
        spotLight.castShadow = lightData.castshadow;
        spotLight.shadow.mapSize.width = lightData.shadowmap;
        spotLight.shadow.mapSize.height = lightData.shadowmap;
        spotLight.shadow.camera.far = lightData.shadowfar;
        this.lights.set(lightData.id, spotLight);
        this.lightEnabled.set(lightData.id, lightData.enabled);
    }
  }
}

export { MyLights };
