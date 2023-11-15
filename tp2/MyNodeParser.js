import * as THREE from "three";
import { MyApp } from "./MyApp.js";
import { MyLights } from "./MyLights.js";
import { MyBox } from "./Primitives/MyBox.js"
import { MyRectangle } from "./Primitives/MyRectangle.js"
import { MySphere } from "./Primitives/MySphere.js"
import { MyTriangle } from "./Primitives/MyTriangle.js"
import { MyCylinder } from "./Primitives/MyCylinder.js"
import { MyNurbs } from "./Primitives/MyNurbs.js"

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

    const combinedMatrix = this.transformations(this.nodes[this.rootId]);
    mainGroup.applyMatrix4(combinedMatrix);

    let materialID = null;
    if (this.nodes[this.rootId].materialIds) {
      materialID = this.nodes[this.rootId].materialIds[0];
    }

    children = this.children(this.rootId, materialID, this.nodes[this.rootId].castShadows, this.nodes[this.rootId].receiveShadows );
    for (let child of children) {
      mainGroup.add(child);
    }

    this.contents.app.scene.add(mainGroup);
  }

  children(nodeId, materialID, castshadow, receiveshadows) {
    let children = [];
    let node = this.nodes[nodeId];
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      if (child.type === "primitive") {
        let materialObj = this.contents.materials.get(materialID);
        if(!this.contents.materialsObjects.includes(materialObj)){
          this.material=materialObj;
          console.log("materialObj", materialObj, materialID)
        }
        else
          this.material=materialObj.clone()
        this.contents.materialsObjects.push(this.material)
        switch (child.subtype) {
          case "box":
            let box = new MyBox(child.representations[0])
            let boxObject = box.addMaterial(this.material, castshadow, receiveshadows);
            this.contents.primitivesObjects.set(child.id, boxObject);
            children.push(boxObject);
            break;
          case "cylinder":
            let cylinder = new MyCylinder(child.representations[0]);
            let cylinderObject = cylinder.addMaterial(this.material, castshadow, receiveshadows)
            this.contents.primitivesObjects.set(child.id, cylinderObject);
            children.push(cylinderObject);
            break;
          case "rectangle":
            let rectangle = new MyRectangle(child.representations[0]);
            let rectangleObject = rectangle.addMaterial(this.material, castshadow, receiveshadows)
            this.contents.primitivesObjects.set(child.id, rectangleObject);
            children.push(rectangleObject);
            break;
          case "sphere":
            let sphere = new MySphere(child.representations[0]);
            let sphereObject = sphere.addMaterial(this.material, castshadow, receiveshadows);
            this.contents.primitivesObjects.set(child.id, sphereObject);
            children.push(sphereObject);
            break;
          case "triangle":
            let data = child.representations[0]
            let triangle = new MyTriangle(data.xyz1[0], data.xyz1[1], data.xyz1[2], data.xyz2[0], data.xyz2[1], data.xyz2[2], data.xyz3[0], data.xyz3[1], data.xyz3[2], this.material, castshadow, receiveshadows);
            let triangleObject = triangle.addMaterial();
            children.push(triangleObject);
            break;
          case "nurbs":
            let nurbs = new MyNurbs(child.representations[0]);
            let nurbsObject = nurbs.addMaterial(this.material, castshadow, receiveshadows);
            this.contents.primitivesObjects.set(child.id, nurbsObject);
            children.push(nurbsObject);
            break;
          default:
            break;
        }

      } else if (child.type === "pointlight" || child.type === "directionallight" || child.type === "spotlight") {
        this.myLights.createLight(child);
        let light=this.contents.lights.get(child.id)
        if(!child.enabled){
          light.visible=false;
        }
        children.push(this.contents.lights.get(child.id));
        children.push(this.contents.lightsHelper.get(child.id));
      } else {
        let childGroup;
        if (!this.contents.nodeObjects.has(child.id)) {
          childGroup = new THREE.Group();

          //transformations
          let combinedMatrix = this.transformations(child);
          childGroup.applyMatrix4(combinedMatrix);

          //material
          let newMaterialID = materialID;
          if (child.materialIds.length > 0) {
            newMaterialID = child.materialIds[0];
          }

          //children
          let tempChildren = this.children(child.id, newMaterialID, child.castShadows || castshadow, child.receiveShadows || receiveshadows);
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

  // transformations(node) {
  //   // Initialize transformation matrices
  //   const translationMatrix = new THREE.Matrix4();
  //   const rotationMatrix = new THREE.Matrix4();
  //   const scaleMatrix = new THREE.Matrix4();

  //   if (node.transformations) {
  //     for (let trans of node.transformations) {
  //       switch (trans.type) {
  //         case "T":
  //           // Accumulate translation
  //           translationMatrix.multiply(new THREE.Matrix4().makeTranslation(trans.translate[0], trans.translate[1], trans.translate[2]));
  //           break;
  //         case "R":
  //           // Accumulate rotation
  //           const rotationEuler = new THREE.Euler(trans.rotation[0] * Math.PI / 180, trans.rotation[1] * Math.PI / 180, trans.rotation[2] * Math.PI / 180);
  //           rotationMatrix.multiply(new THREE.Matrix4().makeRotationFromEuler(rotationEuler));
  //           break;
  //         case "S":
  //           // Accumulate scale
  //           scaleMatrix.multiply(new THREE.Matrix4().makeScale(trans.scale[0], trans.scale[1], trans.scale[2]));
  //           break;
  //       }
  //     }
  //   }

  //   return new THREE.Matrix4().multiply(translationMatrix).multiply(rotationMatrix).multiply(scaleMatrix);

  // }

  transformations(node) {
    // Initialize the childGroup's transformation
    let childTransform = new THREE.Matrix4();
    childTransform.identity();

    if (node.transformations) {
      for (let trans of node.transformations) {
        switch (trans.type) {
          case "T":
            // Accumulate translation
            const translateMatrix = new THREE.Matrix4();
            translateMatrix.makeTranslation(trans.translate[0], trans.translate[1], trans.translate[2]);
            childTransform.multiply(translateMatrix);
            break;
          case "R":
            // Accumulate rotation
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationFromEuler(new THREE.Euler(trans.rotation[0] * Math.PI / 180, trans.rotation[1] * Math.PI / 180, trans.rotation[2] * Math.PI / 180));
            childTransform.multiply(rotationMatrix);
            break;
          case "S":
            // Accumulate scale
            const scaleMatrix = new THREE.Matrix4();
            scaleMatrix.makeScale(trans.scale[0], trans.scale[1], trans.scale[2]);
            childTransform.multiply(scaleMatrix);
            break;
        }
      }
    }
    return childTransform;
  }

}

export { MyNodeParser };
