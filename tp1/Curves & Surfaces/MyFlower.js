import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * This class contains a Flower representation
 */
class MyFlower extends THREE.Object3D {

    /**
     * 
     */
    constructor(app, size, color, position, angle, shadow=false) {
        super();
        this.app = app;
        this.size = size || 2;
        this.color = color;
        this.shadow = shadow;
        this.meshes = [];
        this.samplesU = 20; // maximum defined in MyGuiInterface
        this.samplesV = 20; // maximum defined in MyGuiInterface
        this.builder = new MyNurbsBuilder();

        this.petalTexture = new THREE.TextureLoader().load("Textures/petal.jpg");
        this.petalTexture.repeat.set(5, 5);
        this.materialPetal = new THREE.MeshPhongMaterial({shininess: 50,  map: this.petalTexture, side: THREE.DoubleSide });

        this.createFLower();
        this.position.set(position[0], position[1], position[2]);
        this.rotation.y = angle;

    }

    createFLower() {
       
        // Center of the flower
        const flowerCenterShape = new THREE.Shape();
        flowerCenterShape.moveTo(0, -0.1); // Move to the starting point
        flowerCenterShape.absarc(0, 0, 0.2, 0, Math.PI * 2, false); // Create a filled circle shape

        // Extrude the shape to give it thickness
        const extrusionSettings = {
            steps: 1, // Number of depth layers
            depth: 0.01, // Adjust the thickness here
            bevelEnabled: false, // No bevel
        };

        const flowerCenterGeometry = new THREE.ExtrudeGeometry(flowerCenterShape, extrusionSettings);
        const flowerCenterMaterial = new THREE.MeshPhongMaterial({ color: 0x513A26, side: THREE.DoubleSide });
        const flowerCenterMesh = new THREE.Mesh(flowerCenterGeometry, flowerCenterMaterial);
        if (this.shadow) {
            flowerCenterMesh.castShadow = true;
        }
        flowerCenterMesh.position.set(0, 1.3, 0);
        this.add(flowerCenterMesh);

        // Petals
        const numPetals = 17; // Adjust the number of petals as needed
        const petalAngleIncrement = (Math.PI * 2) / numPetals;

        for (let i = 0; i < numPetals; i++) {
            // Create an elliptical petal using a custom geometry
            const petalGeometry = new THREE.ShapeGeometry(this.createPetalShape());
            const petalMesh = new THREE.Mesh(petalGeometry, this.materialPetal);
            if (this.shadow) {
                petalMesh.castShadow = true;
            }

            // Position each petal around the flower center
            const angle = i * petalAngleIncrement;
            const radius = 0.29; // Adjust the radius as needed
            const x = radius * Math.cos(angle);
            const z = 0;
            const y = 1.3 + radius * Math.sin(angle); // Adjust the height of the petals as needed
            petalMesh.position.set(x, y, z);

            // Rotate petals to face outward
            petalMesh.rotation.z = angle - Math.PI / 2;

            this.add(petalMesh);


            const coneGeometry = new THREE.ConeGeometry(radius, 0.15, 32);
            const coneMaterial = new THREE.MeshPhongMaterial({ color: 0xbdecb6 });
            const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
            coneMesh.rotateY()
        
            // Position the cone
            coneMesh.position.set(0, 1.3, 0); // Adjust the position as needed
            if (this.shadow) {
                coneMesh.castShadow = true;
            }
        
            this.add(coneMesh);
        }

         // Back of the flower
         const material = new THREE.MeshPhongMaterial({ color: 0xbdecb6 });
         let backHeight = 0.07; 
         const flowerBackGeometry = new THREE.ConeGeometry(0.22, backHeight, 32);
         const flowerBackMesh = new THREE.Mesh(flowerBackGeometry, material);
         flowerBackMesh.rotateX(-Math.PI/2);
         // Position the cone
         flowerBackMesh.position.set(0, 1.3, -backHeight/2-0.005); // Adjust the position as needed
 
         this.add(flowerBackMesh);
         // Stem of the flower
         const stem = new THREE.CatmullRomCurve3([
             new THREE.Vector3(0, 0, 0),
             new THREE.Vector3(0, 0.7, 0),
             new THREE.Vector3(0, 1, -0.2),
             new THREE.Vector3(0, 1.2, -backHeight-0.1),
             new THREE.Vector3(0, 1.3, -backHeight+0.01)
         ]);
         const tubeRadius = 0.01; // Adjust this value to control the stem's radius
         const tubeSegments = 100; // Adjust this value to control the smoothness of the tube
 
         const geometryStem = new THREE.TubeGeometry(stem, tubeSegments, tubeRadius, 8, false);
         const stemObject = new THREE.Mesh(geometryStem, material);
         if (this.shadow) {
             stemObject.castShadow = true;
         }
         this.add(stemObject);
    }

    createPetalShape() {
        const petalShape = new THREE.Shape();
        petalShape.ellipse(0, 0, 0.06, 0.12, 0, Math.PI * 2, false, 0);
        return petalShape;
    }

}

MyFlower.prototype.isGroup = true;
export { MyFlower };