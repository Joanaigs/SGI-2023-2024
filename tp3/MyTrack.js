import * as THREE from "three";
import { MyApp } from "./MyApp.js";

class MyTrack {
    /**
     * Constructs the object
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app;
        this.track1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-20, 50, 20),
            new THREE.Vector3(0, 50, 0),
            new THREE.Vector3(20, 50, 20)
        ]);

        // Define parameters for track generation
        this.segments = 10; // Adjust as needed
        this.width = 3; // Adjust as needed
        this.closedCurve = false; // Adjust as needed

        // Material for the track
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        // Wireframe material for the track
        this.wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true
        });

        // Flag to show/hide mesh and wireframe
        this.showMesh = true;
        this.showLine = true;
    }

    drawTrack(track) {
        if (track === 1) {
            this.path = this.track1;
        }

        let points = this.path.getPoints(this.segments);

        // Create a buffer geometry to hold the track vertices
        let bGeometry = new THREE.BufferGeometry();

        // Arrays to hold vertex positions, normals, and indices
        let positions = [];
        let normals = [];
        let indices = [];

        // Function to calculate the normal at a given point on the track
        function calculateNormal(point, nextPoint, prevPoint) {
            let tangent = new THREE.Vector3();
            let normal = new THREE.Vector3();

            // Compute tangent
            tangent.subVectors(nextPoint, prevPoint).normalize();

            // Compute normal in the x-z plane
            normal.set(-tangent.z, 0, tangent.x).normalize();

            return normal;
        }

        // Iterate through each point on the track
        for (let i = 0; i < points.length; i++) {
            let point = points[i];

            // Calculate the normal at the current point
            let normal = calculateNormal(
                points[(i + 1) % points.length], // next point
                points[i],                        // current point
                points[(i - 1 + points.length) % points.length] // previous point
            );

            // Use the normal to calculate the positions of the two points before
            let widthVector = normal.clone().multiplyScalar(this.width / 2);
            let widthPoint1 = point.clone().add(widthVector);
            let widthPoint2 = point.clone().sub(widthVector);

            // Add positions, normals, and indices to the arrays
            positions.push(widthPoint1.x, widthPoint1.y, widthPoint1.z);
            positions.push(point.x, point.y, point.z);
            positions.push(widthPoint2.x, widthPoint2.y, widthPoint2.z);
            if(i != points.length-1){
                indices.push(i, i + 1, i + 2);
                indices.push(i + 1, i+2, i+5);
                indices.push(i + 1, i+4, i+2);
            }

            normals.push(0, 1, 0);
            normals.push(0, 1, 0);
            normals.push(0, 1, 0);

        }

        // Set the buffer attributes
        bGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        bGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        bGeometry.setIndex(indices);

        // Create the final object to add to the scene
        this.lineMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        this.line = new THREE.Mesh(bGeometry, this.lineMaterial);

        this.curve = new THREE.Group();
        this.curve.add(this.line);

        this.line.visible = this.showLine;

        this.app.scene.add(this.curve);
    }
}

export { MyTrack };
