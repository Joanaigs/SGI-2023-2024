import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';
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
     * @param {THREE.MeshPhongMaterial} materialBase the material of the base of the lampshade
     * @param {hex} lampshadeColor the color of the lampshade
     * @param {list} position the position of the lampshade
     * @param {number} angle the angle of the lampshade
     * @param {bool} upsideDown true if the lampshade is upside down
     */
    constructor(app, height, cylinderHeight, radius, materialBase, lampshadeColor, position, angle=0, upsideDown = false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.height = height;
        this.materialBase = materialBase;
        this.lampshadeColor = lampshadeColor;
        this.radius = radius;
        this.upsideDown = upsideDown;
        this.cylinderHeight = cylinderHeight;
        this.lampPosition= position;
        this.angle = angle;

        this.rotateAngle = 0;
        if(this.upsideDown) this.rotateAngle = -Math.PI;
        this.buildLampshade();
        this.rotateX(this.rotateAngle);
        this.position.set(position[0], position[1], position[2]);

    }

    /**
     * Builds the lampshade
     */
    buildLampshade(){
        const materialLampshade = new THREE.MeshPhongMaterial({ color: this.lampshadeColor,  emissive: "#aaaaaa", side: THREE.DoubleSide, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
        const materialBulb = new THREE.MeshPhongMaterial({ color: 0xffffdd, emissive: "#ffffdd"});

        // Cone on the bottom of the base 
        const coneHeight = this.height / 16;
        const geometryCone = new THREE.ConeGeometry(this.radius / 2, coneHeight, 32);
        const cone = new THREE.Mesh(geometryCone, this.materialBase);
        cone.position.set(0,  coneHeight/2, 0);
        this.add(cone);

        // Lampshade base
        const geometryBase = new THREE.CylinderGeometry(this.radius / 16, this.radius / 8, this.height, 32, 1);
        const base = new THREE.Mesh(geometryBase, this.materialBase);
        base.position.set(0,  this.height / 2 + coneHeight/2, 0);
        this.add(base);

        // Bulb
        const sphereRadius = this.radius / 4; 
        const geometrySphere = new THREE.SphereGeometry(sphereRadius, 32, 32);
        const sphere = new THREE.Mesh(geometrySphere, materialBulb);
        this.rotateX(this.angle);
        sphere.position.set(0,  this.height + coneHeight/2 , 0); 
        this.add(sphere);

        // Defining if it's upsideDown or not, so it can be used on the ceiling and on the ground
        let geometryCylinder;
        if(this.upsideDown) 
            geometryCylinder = new THREE.CylinderGeometry(sphereRadius * 4, sphereRadius * 3, this.cylinderHeight, 32, 1, true); 
        else
            geometryCylinder = new THREE.CylinderGeometry(sphereRadius * 3, sphereRadius * 4, this.cylinderHeight, 32, 1, true);

        const cylinder = new THREE.Mesh(geometryCylinder, materialLampshade);
        cylinder.rotateX(this.angle);
        cylinder.position.set(0,  this.height + sphereRadius * 1.2, 0); 
        this.add(cylinder);
    }


}

MyLampshade.prototype.isGroup = true;
export { MyLampshade };
