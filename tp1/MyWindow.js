import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { MyFrame } from './MyFrame.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * This class contains a Window representation
 */
class MyWindow extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {string} contentTexturePath the path to the place texture 
     * @param {string} frameTexturePath the path to the frame texture
     */
    constructor(app, contentTexturePath, frameTexturePath) {
        super();
        this.app = app;
        this.type = 'Group';
        RectAreaLightUniformsLib.init();
        this.height = 10;
        this.length = 13.5
        let position1 = [-15 + 0.10, 0, -2.5 + 0.25];
        let position2 = [-15 + 0.10, 0, 17.5 - 0.25];
        this.builder = new MyNurbsBuilder();

        this.rightWindow = new MyFrame(this.app, 0.2, this.length, this.height, 0x5d2906, position1, -Math.PI / 2, "", frameTexturePath, true);
        this.buildCurtains([position1[0] + 1.5, position1[1] + this.height * 0.5 + 0.5, position1[2] - this.length / 2 + 1], -Math.PI / 3);
        this.metalRod([position1[0], position1[1] + this.height + 0.5, position1[2]]);
        this.leftWindow = new MyFrame(this.app, 0.2, this.length, this.height, 0x5d2906, position2, -Math.PI / 2, "", frameTexturePath, true);
        this.buildCurtains([position2[0] + 1.5, position2[1] + this.height * 0.5 + 0.5, position2[2] + this.length / 3 - 0.3], -Math.PI / 3);
        this.metalRod([position2[0], position2[1] + this.height + 0.5, position2[2]]);

        this.add(this.leftWindow);
        this.add(this.rightWindow);



        this.contentTexture = new THREE.TextureLoader().load(contentTexturePath);
        this.diffusePlaneColor = "#aaaaaa";
        this.contentMaterial = new THREE.MeshBasicMaterial({
            color: this.diffusePlaneColor,
            map: this.contentTexture
        });
        let ratio = 608/402;
        this.contentPlane = new THREE.Mesh(new THREE.PlaneGeometry(ratio * 25, 25 / ratio), this.contentMaterial);
        this.contentPlane.rotateY(Math.PI / 2);
        this.contentPlane.position.set(-16, 5, 7.5);
        this.add(this.contentPlane);


    }
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
    buildCurtains(position, rotation) {

        this.material = new THREE.MeshPhongMaterial({
            color: 0xc0d3dd,
            side: THREE.DoubleSide,
            opacity: 0.8,
            transparent: true,
            map: this.app.textureCurtain,
        });
        // Declare local variables
        let controlPoints1;
        let surfaceData1;
        let mesh1;
        let orderU = 3; // Higher order for smoother curves
        let orderV = 1; // Higher order for smoother curves

        // Define control points for the first NURBS surface (lower part of the vase)

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

            [
                [2.0, -1.0, 2.0, 1],
                [2.0, 1.0, 2.0, 1],
            ],





        ];

        // Build the first NURBS surface (lower part of the vase)
        surfaceData1 = this.builder.build(
            controlPoints1,
            orderU,
            orderV,
            20,
            20,
            this.material
        );



        // Create meshes for the two NURBS surfaces
        mesh1 = new THREE.Mesh(surfaceData1, this.material);
        mesh1.scale.set(1, this.height * 0.55, 1);
        mesh1.rotateY(rotation);
        mesh1.position.set(position[0], position[1], position[2]);
        this.add(mesh1);
    }
}
MyWindow.prototype.isGroup = true;
export { MyWindow };
