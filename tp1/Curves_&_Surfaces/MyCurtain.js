import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * This class contains a Curtain representation
 */
class MyCurtain extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {list} position the position of the window
     * @param {number} rotation the rotation of the curtain
     */
    constructor(app, height, length, positionMetalRod, positionCurtain, rotation) {
        super();
        this.app = app;
        this.type = 'Group';
        this.app = app;
        this.height = height;
        this.length = length;
        
        this.builder = new MyNurbsBuilder();

        this.buildCurtains(positionCurtain, rotation);
        this.metalRod(positionMetalRod);

    }

    /**
     * Adds a metal rod to the window
     * @param {list} position the position of the metal rod
     */
    metalRod(position) {
        let geometry = new THREE.CylinderGeometry(0.1, 0.1, this.length, 32);
        let material = new THREE.MeshPhongMaterial({ color: 0x000000 });
        let cylinder = new THREE.Mesh(geometry, material);
        cylinder.rotateX(Math.PI / 2);
        cylinder.position.set(position[0] + 0.5, position[1], position[2]);
        this.add(cylinder);

        //stands
        let geometry2 = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
        let cylinder2 = new THREE.Mesh(geometry2, material);
        cylinder2.rotateZ(Math.PI / 2);
        cylinder2.position.set(position[0] + 0.25, position[1], position[2] + this.length / 2);
        this.add(cylinder2);

        let cylinder3 = new THREE.Mesh(geometry2, material);
        cylinder3.rotateZ(Math.PI / 2);
        cylinder3.position.set(position[0] + 0.25, position[1], position[2] - this.length / 2);
        this.add(cylinder3);
    }

    /**
     * Builds the curtains
     * @param {list} position the position of the curtain
     * @param {number} rotation the angle of rotation of the curtain
     */
    buildCurtains(position, rotation) {

        this.material = new THREE.MeshPhongMaterial({
            color: 0xc0d3dd,
            side: THREE.DoubleSide,
            opacity: 0.8,
            transparent: true,
            map: this.app.textureCurtain,
        });

        let controlPoints1;
        let surfaceData1;
        let mesh1;
        let orderU = 3; 
        let orderV = 1; 

        // Define control points for curtains
        controlPoints1 = [
            // U = 0
            [
                [-1.0, -1.0, 0.0, 1],
                [-1.0, 1, 0.0, 1],
            ],
            // U = 1
            [
                [0, -1.0, 3.0, 1],
                [0, 1.0, 3.0, 1],
            ],
            // U = 2
            [
                [1.0, -1.0, 0.0, 1],
                [1.0, 1.0, 0.0, 1],
            ],
            // U = 3
            [
                [2.0, -1.0, 2.0, 1],
                [2.0, 1.0, 2.0, 1],
            ],
        ];

        surfaceData1 = this.builder.build(
            controlPoints1,
            orderU,
            orderV,
            20,
            20,
            this.material
        );

        mesh1 = new THREE.Mesh(surfaceData1, this.material);
        mesh1.scale.set(1, this.height * 0.55, 1);
        mesh1.rotateY(rotation);
        mesh1.position.set(position[0], position[1], position[2]);
        this.add(mesh1);
    }
}
MyCurtain.prototype.isGroup = true;
export { MyCurtain };
