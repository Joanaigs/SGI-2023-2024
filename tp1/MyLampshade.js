import * as THREE from 'three';
import { MyApp } from './MyApp';
/**
 * This class contains a Lamshade representation
 */
class MyLampshade extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} height the height of the lampshade
     * @param {number} cylinderHeight the height of the cylinder
     * @param {number} radius the radius of the lampshade
     * @param {string} baseTexturePath the path of the base texture
     * @param {hex} lampshadeColor the color of the lampshade
     * @param {list} position the position of the lampshade
     * @param {bool} upsideDown true if the lampshade is upside down
     */
    constructor(app, height, cylinderHeight, radius, baseTexturePath, lampshadeColor, position, upsideDown = false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.height = height;
        this.baseTexturePath = baseTexturePath;
        this.lampshadeColor = lampshadeColor;
        this.radius = radius;
        this.upsideDown = upsideDown;
        this.cylinderHeight = cylinderHeight;
        this.lampPosition= position;

        this.rotateAngle = 0;
        if(this.upsideDown) this.rotateAngle = -Math.PI;
        this.buildLamp();

        this.position.set(position[0], position[1], position[2]);
        this.rotateX(this.rotateAngle);

    }

    buildLamp(){
        this.baseTexture =new THREE.TextureLoader().load(this.baseTexturePath);
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#000000";
        this.planeShininess = 100;
        const  materialBase = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.baseTexture });

        const materialLampshade = new THREE.MeshPhongMaterial({ color: this.lampshadeColor,  emissive: "#aaaaaa" });
        const materialBulb = new THREE.MeshPhongMaterial({ color: 0xffffdd });

        // Cone at the base of the cylinder
        const coneHeight = this.height / 16;
        const geometryCone = new THREE.ConeGeometry(this.radius / 2, coneHeight, 32);
        const cone = new THREE.Mesh(geometryCone, materialBase);
        cone.position.set(0,  coneHeight/2, 0);
        this.add(cone);


        // Lampshade base
        const geometryBase = new THREE.CylinderGeometry(this.radius / 16, this.radius / 8, this.height, 32, 1);
        const base = new THREE.Mesh(geometryBase, materialBase);
        base.position.set(0,  this.height / 2 + coneHeight/2, 0);
        this.add(base);

        // Sphere on top of the cylinder
        const sphereRadius = this.radius / 4; // Adjust the size as needed
        const geometrySphere = new THREE.SphereGeometry(sphereRadius, 32, 32);
        const sphere = new THREE.Mesh(geometrySphere, materialBulb);
        sphere.position.set(0,  this.height + coneHeight/2 , 0); // Adjust the Y position as needed
        this.add(sphere);

        // Cylinder on top of the sphere
        let geometryCylinder;
        if(this.upsideDown) 
            geometryCylinder = new THREE.CylinderGeometry(sphereRadius * 4, sphereRadius * 3, this.cylinderHeight, 32, 1, true); // Set openEnded to true
        else
            geometryCylinder = new THREE.CylinderGeometry(sphereRadius * 3, sphereRadius * 4, this.cylinderHeight, 32, 1, true); // Set openEnded to true

        const cylinder = new THREE.Mesh(geometryCylinder, materialLampshade);
        cylinder.position.set(0,  this.height + sphereRadius * 1.2, 0); // Adjust the Y position as needed
        this.add(cylinder);
    }


}

MyLampshade.prototype.isGroup = true;
export { MyLampshade };
