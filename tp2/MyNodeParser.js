import * as THREE from "three";
import { MyApp } from "./MyApp.js";
import { MyLights } from "./MyLights.js";
import { MyBox } from "./Primitives/MyBox.js"
import { MyRectangle } from "./Primitives/MyRectangle.js"
import { MySphere } from "./Primitives/MySphere.js"
import { MyTriangle } from "./Primitives/MyTriangle.js"
import { MyCylinder } from "./Primitives/MyCylinder.js"

/**
 * This class creates a Texture
 */
class MyNodeParser {
  constructor(contents, data) {
    this.contents = contents;
    this.nodes = data.nodes;
    this.rootId = data.rootId;
    this.myLights = new MyLights(this.contents);
    this.material = new THREE.MeshPhongMaterial({ color: 0xfff000, shininess: 1, specular: 0x111111, flatShading: true });

  }

  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }


  init() {
    let mainGroup = new THREE.Group();
    let children;
    let position = [0, 0, 0];
    if (this.nodes[this.rootId].transformations) {
      for (let trans of this.nodes[this.rootId].transformations) {
        switch (trans.type) {
          case "T":
            position = trans.translate;
            mainGroup.position.set(trans.translate[0], trans.translate[1], trans.translate[2]);
            break;
          case "R":
            mainGroup.rotation.set(trans.rotation[0] * Math.PI / 180, trans.rotation[1] * Math.PI / 180, trans.rotation[2] * Math.PI / 180);
            break;
          case "S":
            mainGroup.scale.set(trans.scale[0], trans.scale[1], trans.scale[2]);
            break;
        }
      }
    }
    children = this.children(this.rootId, position);
    for (let child of children) {
      mainGroup.add(child);
    }
    this.contents.app.scene.add(mainGroup);
  }

  children(nodeId, position) {
    let children = [];
    let node = this.nodes[nodeId];
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      if (child.type === "primitive") {
        switch (child.subtype) {
          case "box":
            console.log("box", child.representations[0])
            let box = new MyBox(child.representations[0])
            let boxObject = box.addMaterial(this.material);
            this.contents.primitivesObjects.set(child.id, boxObject);
            children.push(boxObject);
            break;
          case "cylinder":
            console.log("cy", child)
            let cylinder = new MyCylinder(child.representations[0]);
            let cylinderObject = cylinder.addMaterial(this.material)
            this.contents.primitivesObjects.set(child.id, cylinderObject);
            children.push(cylinderObject);
            break;
          case "rectangle":
            console.log("rec", child.representations[0]);
            let rectangle = new MyRectangle(child.representations[0]);
            let rectangleObject = rectangle.addMaterial(this.material)
            this.contents.primitivesObjects.set(child.id, rectangleObject);
            children.push(rectangleObject);
            break;
          case "sphere":
            console.log("sphere", child)
            let sphere = new MySphere(child.data.representations[0]);
            let sphereObject = sphere.addMaterial(this.material);
            this.contents.primitivesObjects.set(child.id, sphereObject);
            children.push(sphereObject);
            break;
          case "triangle":
            console.log("tri", child)
            let triangle = new MyTriangle(child.data.representations[0])
            let triangleObject = triangle.addMaterial(this.material);
            this.contents.primitivesObjects.set(child.id, triangleObject);
            children.push(triangleObject);
            break;
          default:
            break;
        }

      } else if (child.type === "pointlight" || child.type === "directionallight" || child.type === "spotlight") {
        this.myLights.createLight(child, position);
        //children.push(this.contents.lights.get(child.id));
        //children.push(this.contents.lightsHelper.get(child.id));
      } else {
        let childGroup;
        if (!this.contents.nodeObjects.has(child.id)) {
          childGroup = new THREE.Group();
          let newPosition = position;
          if (child.transformations) {
            for (let trans of child.transformations) {
              switch (trans.type) {
                case "T":
                  console.log("hi")
                  newPosition = [position[0] + trans.translate[0], position[1] + trans.translate[1], position[2] + trans.translate[2],];
                  childGroup.position.set(trans.translate[0], trans.translate[1], trans.translate[2]);
                  break;
                case "R":
                  childGroup.rotation.set(trans.rotation[0] * Math.PI / 180, trans.rotation[1] * Math.PI / 180, trans.rotation[2] * Math.PI / 180);
                  break;
                case "S":
                  childGroup.scale.set(trans.scale[0], trans.scale[1], trans.scale[2]);
                  break;
              }
            }
          }
          let tempChildren = this.children(child.id, newPosition);
          for (let tempChild of tempChildren) {
            childGroup.add(tempChild);
          }
          this.contents.nodeObjects.set(child.id, childGroup);
        }
        else
          childGroup = this.contents.nodeObjects.get(child.id).clone();
        children.push(childGroup);
      }
    }

    return children;
  }
}

export { MyNodeParser };
