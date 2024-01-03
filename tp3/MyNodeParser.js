import * as THREE from "three";
import { MyApp } from "./MyApp.js";
import { MyLights } from "./classes/MyLights.js";
import { MyBox } from "./classes/primitives/MyBox.js"
import { MyRectangle } from "./classes/primitives/MyRectangle.js"
import { MySphere } from "./classes/primitives/MySphere.js"
import { MyTriangle } from "./classes/primitives/MyTriangle.js"
import { MyCylinder } from "./classes/primitives/MyCylinder.js"
import { MyNurbs } from "./classes/primitives/MyNurbs.js"
import { MyPolygon } from "./classes/primitives/MyPolygon.js"

/**
 * This class is a parser for the nodes of the scene
 */
class MyNodeParser {

  /**
   * Puts in the parser the data of the scene
   * @param {MyContent} contents the contents object
   * @param {list} data the list of nodes of the scene
   */
  constructor(contents, data) {
    this.contents = contents;
    this.nodes = data.nodes;
    this.lods = data.lods;
    this.rootId = data.rootId;
    this.myLights = new MyLights(this.contents);
    this.material = new THREE.MeshPhongMaterial({ color: 0xfff000, shininess: 1, specular: 0x111111, flatShading: true });

  }

  /**
   * Starts the parsing of the nodes of the scene data
   */
  init() {
    let mainGroup = new THREE.Group();
    let children;

    const combinedMatrix = this.transformations(this.nodes[this.rootId]);
    mainGroup.applyMatrix4(combinedMatrix);

    let materialID = null;
    if (this.nodes[this.rootId].materialIds) {
      materialID = this.nodes[this.rootId].materialIds[0];
    }

    children = this.children(this.rootId, materialID, this.nodes[this.rootId].castShadows, this.nodes[this.rootId].receiveShadows);
    for (let child of children) {
      mainGroup.add(child);
    }

    this.contents.app.scene.add(mainGroup);
  }

  /**
   * Recursive function that goes through the children of the nodes and creates the objects, groups, lods and lights
   * @param {string} nodeId id of the node
   * @param {string} materialID id of the material of the parent node, if it has one
   * @param {boolean} castshadow boolean that indicates if the parent node casts shadows
   * @param {boolean} receiveshadows boolean that indicates if the parent node receives shadows
   * @param {boolean} lod boolean that indicates if the parent node is a lod 
   * @returns the children of the node
   */
  children(nodeId, materialID, castshadow, receiveshadows, lod = false) {
    let children = [];
    let node;
    node = this.nodes[nodeId];
    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      if (child.type === "primitive") {

        let primitive = this.primitiveCreation(child, materialID, castshadow, receiveshadows);
        children.push(primitive);

      } else if (child.type === "pointlight" || child.type === "directionallight" || child.type === "spotlight") {
        this.lightCreation(child);
        children.push(this.contents.lights.get(child.id));
      }
      else if (child.type === "lod") {

        let childLod = this.lodCreation(child, materialID, castshadow, receiveshadows)
        children.push(childLod);

      }
      else {
        let childGroup = this.nodeCreation(child, materialID, castshadow, receiveshadows);
        children.push(childGroup);
      }
    }

    return children;
  }


  /**
   * Creates the primitive according to the data received
   * @param {Dictionary} child a dictionary with the data of the primitive
   * @param {string} materialID a string with the id of the material of the primitive
   * @param {boolean} castshadow a boolean that indicates if the primitive casts shadows
   * @param {boolean} receiveshadows a boolean that indicates if the primitive receives shadows
   * @returns the primitive object
   */
  primitiveCreation(child, materialID, castshadow, receiveshadows) {
    let materialObj = this.contents.materials.get(materialID);
    if (materialObj)
      this.material = materialObj.clone()
    this.contents.materialsObjects.push(this.material)
    switch (child.subtype) {
      case "box":
        let box = new MyBox(this.contents, child.representations[0])
        let boxObject = box.addMaterial(this.material, castshadow, receiveshadows);
        this.contents.primitivesObjects.set(child.id, boxObject);
        return boxObject;
      case "cylinder":
        let cylinder = new MyCylinder(child.representations[0]);
        let cylinderObject = cylinder.addMaterial(this.material, castshadow, receiveshadows)
        this.contents.primitivesObjects.set(child.id, cylinderObject);
        return cylinderObject;
      case "rectangle":
        let rectangle = new MyRectangle(child.representations[0]);
        let rectangleObject = rectangle.addMaterial(this.material, castshadow, receiveshadows)
        this.contents.primitivesObjects.set(child.id, rectangleObject);
        return rectangleObject;
      case "sphere":
        let sphere = new MySphere(child.representations[0]);
        let sphereObject = sphere.addMaterial(this.material, castshadow, receiveshadows);
        this.contents.primitivesObjects.set(child.id, sphereObject);
        return sphereObject;
      case "triangle":
        let data = child.representations[0]
        let triangle = new MyTriangle(data.xyz1[0], data.xyz1[1], data.xyz1[2], data.xyz2[0], data.xyz2[1], data.xyz2[2], data.xyz3[0], data.xyz3[1], data.xyz3[2], this.material, castshadow, receiveshadows);
        let triangleObject = triangle.addMaterial();
        return triangleObject;
      case "nurbs":
        let nurbs = new MyNurbs(child.representations[0]);
        let nurbsObject = nurbs.addMaterial(this.material, castshadow, receiveshadows);
        this.contents.primitivesObjects.set(child.id, nurbsObject);
        return nurbsObject;
      case "polygon":
        let polygon = new MyPolygon(child.representations[0]);
        let polygonObject = polygon.addMaterial(this.material, castshadow, receiveshadows);
        this.contents.primitivesObjects.set(child.id, polygonObject);
        return polygonObject;
      default:
        break;
    }
  }

  /**
   * Creates the light according to the data received
   * @param {Dictionary} child a dictionary with the data of the light
   */
  lightCreation(child) {
    this.myLights.createLight(child);
    let light = this.contents.lights.get(child.id)
    if (!child.enabled) {
      light.visible = false;
    }
  }

  /**
   * Deals with the creation of the lods and its children
   * @param {Dictionary} child the dictionary with the data of the lod
   * @param {string} materialID the id of the material of the lod
   * @param {boolean} castshadow a boolean that indicates if the lod casts shadows
   * @param {boolean} receiveshadows a boolean that indicates if the lod receives shadows
   * @returns 
   */
  lodCreation(child, materialID, castshadow, receiveshadows) {
    let childLod;
    if (!this.contents.nodeObjects.has(child.id)) {
      childLod = new THREE.LOD();

      //children
      for (let i = 0; i < child.children.length; i++) {
        let childLodChild = child.children[i];
        let childGroup = this.nodeCreation(childLodChild.node, materialID, castshadow, receiveshadows);
        childLod.addLevel(childGroup, childLodChild.mindist);
      }
      this.contents.nodeObjects.set(child.id, childLod);
    }
    else {
      childLod = this.contents.nodeObjects.get(child.id).clone();
    }
    return childLod;
  }

  /**
   * Deals with the creation of the nodes and its children
   * @param {Dictionary} child the dictionary with the data of the node
   * @param {string} materialID the id of the material of the node
   * @param {boolean} castshadow a boolean that indicates if the node casts shadows
   * @param {boolean} receiveshadows a boolean that indicates if the node receives shadows
   * @returns 
   */
  nodeCreation(child, materialID, castshadow, receiveshadows) {
    let childGroup;
    childGroup = new THREE.Group();

    //transformations
    let combinedMatrix = this.transformations(child);
    childGroup.applyMatrix4(combinedMatrix);

    //material
    let newMaterialID = materialID;
    if (child.materialIds && child.materialIds.length > 0) {
      newMaterialID = child.materialIds[0];
    }

    //children
    let tempChildren = this.children(child.id, newMaterialID, child.castShadows || castshadow, child.receiveShadows || receiveshadows);
    for (let tempChild of tempChildren) {
      childGroup.add(tempChild);
    }
    this.contents.nodeObjects.set(child.id, childGroup);

    return childGroup;
  }

  /**
   * Creates the transformation matrix of the node
   * @param {Dictionary} node a dictionary with the data of the node
   * @returns the transformation matrix of the node
   */
  transformations(node) {
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
            rotationMatrix.makeRotationFromEuler(new THREE.Euler(trans.rotation[0], trans.rotation[1], trans.rotation[2]));
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
