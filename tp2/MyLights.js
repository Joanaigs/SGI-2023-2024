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
        if (directionalLight.castShadow) {
          directionalLight.castShadow = lightData.castshadow;
          directionalLight.shadow.mapSize.width = lightData.shadowmap;
          directionalLight.shadow.mapSize.height = lightData.shadowmap;
          directionalLight.shadow.camera.far = lightData.shadowfar;
          directionalLight.shadow.camera.left = lightData.shadowleft;
          directionalLight.shadow.camera.right = lightData.shadowright;
          directionalLight.shadow.camera.top = lightData.shadowtop;
          directionalLight.shadow.camera.bottom = lightData.shadowbottom;
        }
        let helper2 = new THREE.DirectionalLightHelper(directionalLight);
        this.content.lights.set(lightData.id, directionalLight);
        this.content.lightsHelper.set(lightData.id, helper2);
        this.content.lightEnabled[lightData.id] = lightData.enabled;
        break;

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
        if (pointLight.castShadow) {
          pointLight.castShadow = lightData.castshadow;
          pointLight.shadow.mapSize.width = lightData.shadowmap;
          pointLight.shadow.mapSize.height = lightData.shadowmap;
          pointLight.shadow.camera.far = lightData.shadowfar;
        }
        let helper1 = new THREE.PointLightHelper(pointLight);
        this.content.lights.set(lightData.id, pointLight);
        this.content.lightsHelper.set(lightData.id, helper1);
        this.content.lightEnabled[lightData.id] = lightData.enabled;
        break;
      case "spotlight":
        let spotLight = new THREE.SpotLight(
          lightData.color,
          lightData.intensity,
          lightData.distance,
          lightData.angle*180/Math.PI,
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
        this.content.app.scene.add(target);
        spotLight.target = target;
        if (spotLight.castShadow) {
          spotLight.castShadow = lightData.castshadow;
          spotLight.shadow.mapSize.width = lightData.shadowmap;
          spotLight.shadow.mapSize.height = lightData.shadowmap;
          spotLight.shadow.camera.far = lightData.shadowfar;
        }
        let helper = new THREE.SpotLightHelper(spotLight);
        this.content.lights.set(lightData.id, spotLight);
        this.content.lightsHelper.set(lightData.id, helper);
        this.content.lightEnabled[lightData.id] = lightData.enabled;
        break;
    }
  }
}

export { MyLights };
