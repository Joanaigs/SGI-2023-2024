import * as THREE from "three";

/**
 * This class creates a track
 */
class MyTrack {
    /**
     * Creates a track
     * @param {MyApp} app The application object
     */
    constructor(app, size, width, position) {
        this.app = app;
        this.position = position;
        let i = size;
        this.width = width;
        this.track1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(8 * i, 0, i * 5), //start
            new THREE.Vector3(8 * i, 0, i * 4),
            new THREE.Vector3(8 * i, 0, i * 2),
            new THREE.Vector3(6 * i, 0, i * 1),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-0.5*i, 0, i * 1.3),
            new THREE.Vector3(0, 0, i * 2),
            new THREE.Vector3(4 * i, 0, i * 3),
            new THREE.Vector3(5 * i, 0, i * 4.5),

            new THREE.Vector3(4 * i, 0, i * 6),
            new THREE.Vector3(3 * i, 0, i * 6),
            new THREE.Vector3(1.5 * i, 0, i * 5.2),

            new THREE.Vector3(0 * i, 0, i * 6),
            new THREE.Vector3(0 * i, 0, i * 15),
            new THREE.Vector3(1.5 * i, 0, i * 16),
            new THREE.Vector3(3 * i, 0, i * 15),
            new THREE.Vector3(3 * i, 0, i * 10),
            new THREE.Vector3(4 * i, 0, i * 9.5),
            new THREE.Vector3(5 * i, 0, i * 10),
            new THREE.Vector3(6 * i, 0, i * 13),
            new THREE.Vector3(7 * i, 0, i * 13.5),
            new THREE.Vector3(8 * i, 0, i * 13),
            new THREE.Vector3(8 * i, 0, i * 10),

            new THREE.Vector3(8 * i, 0, i * 6),

            new THREE.Vector3(8 * i, 0, i * 5), //start
        ]);

        this.trackCut = new THREE.CatmullRomCurve3([
            new THREE.Vector3(6 * i, 0, i * 13),
            new THREE.Vector3(3 * i, 0, i * 15)

        ]);

        // Define parameters for track generation
        this.segments = 300; 
        this.closedCurve = false; 


        // Flag to show/hide mesh and wireframe
        this.showMesh = true;
        this.showLine = true;


    }

    /**
     * FOr the a segment returns the UV coordinates
     * @param {number} segmentLength  the length of the segment
     * @param {Number} totalLength the total length of the track
     * @returns 
     */
    calculateUVCoordinates(segmentLength, totalLength) {
        let uvScale = this.nextUvScale ;
        this.nextUvScale += (segmentLength / totalLength);
        if(uvScale > 1) uvScale = 1;
        return [0, uvScale, 0.5, uvScale, 1, uvScale];
    }

    /**
     * Creates a buffer geometry for the track
     * @param {number} track id of the track 
     * @param {THREE.Material} material the material of the track 
     * @returns the track object
     */
    drawTrack(track, material) {
        this.nextUvScale = 0;
        this.material = material;
        if (track === 1) {
            this.path = this.track1;
        }
        if (track === "Cut") {
            this.path = this.trackCut;
            this.position.y -= 0.35;
        }

        let points = this.path.getPoints(this.segments);

        // Create a buffer geometry to hold the track vertices
        let bGeometry = new THREE.BufferGeometry();

        // Arrays to hold vertex positions, normals, and indices
        let positions = [];
        let normals = [];
        let indices = [];
        let uvs = [];

        // Function to calculate the normal at a given point on the track
        function calculateNormal(point, nextPoint) {
            let tangent = new THREE.Vector3();
            let normal = new THREE.Vector3();

            // Compute tangent
            tangent.subVectors(nextPoint, point).normalize();

            // Compute normal
            normal.crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

            return normal;
        }


        // Iterate through each point on the track
        for (let i = 0; i < points.length ; i++) {
            let point = points[i];
            let normal;
            // Calculate the normal at the current point
            if (i === points.length - 1) {
                normal = calculateNormal(
                    points[(i - 1 + points.length) % points.length], // previous point
                    points[i]                       // current point
                );
            } else {
                normal = calculateNormal(
                    points[i],                        // current point
                    points[(i + 1) % points.length] // next point
                );

            }


            // Use the normal to calculate the positions of the two points before
            let widthVector = normal.clone().multiplyScalar(this.width / 2);
            let widthPoint1 = point.clone().add(widthVector);
            let widthPoint2 = point.clone().sub(widthVector);

            // Add positions, normals, and indices to the arrays
            positions.push(widthPoint1.x, widthPoint1.y, widthPoint1.z);
            positions.push(point.x, point.y, point.z);
            positions.push(widthPoint2.x, widthPoint2.y, widthPoint2.z);

            let segmentLength = points[i].distanceTo(points[(i + 1) % points.length]);
            let totalLength = this.path.getLength();
            let uvCoordinates = this.calculateUVCoordinates(segmentLength, totalLength);

            uvs.push(...uvCoordinates);



            if (i != points.length - 1) {
                let point_indx = i * 3;
                indices.push(point_indx + 1, point_indx, point_indx + 3);
                indices.push(point_indx + 2, point_indx + 1, point_indx + 5);
                indices.push(point_indx + 4, point_indx + 1, point_indx + 3);
                indices.push(point_indx + 5, point_indx + 1, point_indx + 4);



            }

            normals.push(0, 1, 0);
            normals.push(0, 1, 0);
            normals.push(0, 1, 0);

        }


        // Set the buffer attributes
        bGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        bGeometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        bGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
        bGeometry.setIndex(indices);

        // Create the final object to add to the scene

        this.line = new THREE.Mesh(bGeometry, this.material);
        this.line.receiveShadow = true;



        this.curve = new THREE.Group();
        this.curve.add(this.line);

        this.line.visible = this.showLine;
        this.curve.position.set(this.position.x, this.position.y, this.position.z);

        return this.curve;
    }

}

export { MyTrack };
