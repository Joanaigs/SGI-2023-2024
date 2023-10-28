import * as THREE from "three";
import { MyApp } from "./MyApp.js";
import { MyLights } from "./MyLights.js";

/**
 * This class creates a Texture
 */
class MyNodeParser {
  constructor(contents, data) {
    this.contents = contents;
    this.nodes = data.nodes;
    this.rootId = data.rootId;
    this.myLights = new MyLights(this.contents);
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
            mainGroup.position.set(trans.translate[0], trans.translate[1], trans.translate[2]
            );
            break;
          case "R":
            mainGroup.rotation.set(trans.rotation[0], trans.rotation[1], trans.rotation[2]
            );
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
        if (this.contents.primitivesObjects.has(child.id)) {
          let clone = this.contents.primitivesObjects.get(child.id).clone();
          children.push(clone);
        } else {
          //create primitive
        }
      } else if (child.type === "pointlight" || child.type === "directionallight" || child.type === "spotlight") {
        this.myLights.createLight(child, position);
        //children.push(this.contents.lights.get(child.id));
        //children.push(this.contents.lightsHelper.get(child.id));
      } else {
        let childGroup = new THREE.Group();
        let newPosition = position;
        if (child.transformations) {
          for (let trans of child.transformations) {
            switch (trans.type) {
              case "T":
                newPosition = [position[0] + trans.translate[0], position[1] + trans.translate[1], position[2] + trans.translate[2],
                ];
                childGroup.position.set(trans.translate[0], trans.translate[1], trans.translate[2]
                );
                break;
              case "R":
                childGroup.rotation.set(trans.rotation[0], trans.rotation[1], trans.rotation[2]
                );
                break;
              case "S":
                childGroup.scale.set(trans.scale[0], trans.scale[1], trans.scale[2]
                );
                break;
            }
          }
        }
        let tempChildren = this.children(child.id, newPosition);
        for (let tempChild of tempChildren) {
          childGroup.add(tempChild);
        }
        children.push(childGroup);
      }
    }

    return children;
  }
}

export { MyNodeParser };
