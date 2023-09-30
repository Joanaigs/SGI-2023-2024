import * as THREE from 'three';

class MyLampshade extends THREE.Object3D {
    constructor(app, height, radius, baseColor, lampshadeColor, position) {
        super();
        this.app = app;
        this.height = height;
        this.baseColor = baseColor;
        this.lampshadeColor = lampshadeColor;
        this.radius = radius;

        const materialBase = new THREE.MeshBasicMaterial({ color: baseColor });
        const materialLampshade = new THREE.MeshBasicMaterial({ color: lampshadeColor });
        const materialBulb = new THREE.MeshBasicMaterial({ color: 0xffffdd });

        // Lampshade base
        const geometryBase = new THREE.CylinderGeometry(this.radius / 16, this.radius / 8, height, 32, 1);
        const base = new THREE.Mesh(geometryBase, materialBase);
        base.position.set(position[0], position[1] + height / 2, position[2]);
        this.add(base);

        // Sphere on top of the cylinder
        const sphereRadius = this.radius / 4; // Adjust the size as needed
        const geometrySphere = new THREE.SphereGeometry(sphereRadius, 32, 32);
        const sphere = new THREE.Mesh(geometrySphere, materialBulb);
        sphere.position.set(position[0], position[1] + height , position[2]); // Adjust the Y position as needed
        this.add(sphere);

        // Cylinder on top of the sphere
        const cylinderHeight = height / 4; // Adjust the height as needed
        const geometryCylinder = new THREE.CylinderGeometry(sphereRadius * 3, sphereRadius * 4, cylinderHeight, 32, 1, true); // Set openEnded to true
        const cylinder = new THREE.Mesh(geometryCylinder, materialLampshade);
        cylinder.position.set(position[0], position[1] + height + sphereRadius * 1.2, position[2]); // Adjust the Y position as needed
        this.add(cylinder);

        // Cone at the base of the cylinder
        const coneHeight = height / 16;
        const geometryCone = new THREE.ConeGeometry(radius / 2, coneHeight, 32);
        const cone = new THREE.Mesh(geometryCone, materialBase);
        cone.position.set(position[0], position[1] + coneHeight - 0.2, position[2]);
        this.add(cone);
    }
}

MyLampshade.prototype.isGroup = true;
export { MyLampshade };
