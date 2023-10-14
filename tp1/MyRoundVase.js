import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * This class contains a Round Vase representation
 */
class MyRoundVase extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} size the size of each axis 
     * @param {hex} color the color of the vase
     * @param {list} position the position of the vase
     * @param {boolean} shadow if the object has shadow or not
     *
     */
    constructor(app, size, color, position, shadow=false) {
        super();
        this.app = app;
        this.size = size || 2;
        this.shadow = shadow;
        this.color = color;
        this.meshes = [];
        this.samplesU = 20; // maximum defined in MyGuiInterface
        this.samplesV = 20; // maximum defined in MyGuiInterface
        this.builder = new MyNurbsBuilder();
        this.material = new THREE.MeshPhongMaterial({
            color: this.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
        });

        this.createNurbsSurfaces();
        this.position.set(position[0], position[1]*this.size, position[2]);
        this.scale.set(this.size, this.size, this.size);

    }

    createNurbsSurfaces() {
        // Declare local variables
        let controlPoints1;
        let surfaceData1;
        let mesh1, mesh2;
        let orderU = 2; // Higher order for smoother curves
        let orderV = 3; // Higher order for smoother curves

        // Define control points for the first NURBS surface (lower part of the vase)

        controlPoints1 = [
            // U = 0
            [
                [-0.3, -1.0, 0.0, 1],
                [-1.0, 0, 0.0, 1],
                [0.5, 0.8, 0.0, 1],
                [-0.5, 1, 0.0, 1],
            ],
            // U = 1
            [
                [0, -1.0, 0.3, 1],
                [0, 0, 2, 1],
                [0, 0.8,  -1, 1],
                [0, 1.0, 0.8, 1],
            ],
            // U = 2
            [
                [0.3, -1.0, 0.0, 1],
                [1.0, 0, 0, 1],
                [-0.5, 0.8, 0.0, 1],
                [0.5, 1.0, 0.0, 1],
            ],



        ];

        // Build the first NURBS surface (lower part of the vase)
        surfaceData1 = this.builder.build(
            controlPoints1,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );



        // Create meshes for the two NURBS surfaces
        mesh1 = new THREE.Mesh(surfaceData1, this.material);
        if(this.shadow){
            mesh1.castShadow = true;
            //mesh1.receiveShadow = true;
        }
        this.add(mesh1);

        mesh2 = new THREE.Mesh(surfaceData1, this.material);
        if(this.shadow){
            mesh2.castShadow = true;
            //mesh2.receiveShadow = true;
        }
        mesh2.rotateY(Math.PI);
        this.add(mesh2);

        this.meshes.push(mesh1);
    }

}
/*
  controlPoints1 = [
            // U = 0
            [
                [-1.0, -1.0, 0.0, 1],
                [-1.0, 0,0.0, 1],
                [-1.0, 0.8,-1, 1],
                [-1.0, 1, 0.0, 1],
            ],
            // U = 1
            [
                [0, -1.0, 2.0, 1],
                [0, 0, 2, 1],
                [0, 0.8, -1, 1],
                [0, 1.0, 2.0, 1],
            ],
            // U = 2
            [
                [1.0, -1.0, 0.0, 1],
                [1.0, 0, 0, 1],
                [1.0, 0.8, -1, 1],
                [1.0, 1.0, 0.0, 1],
            ],


            
        ];
 */
MyRoundVase.prototype.isGroup = true;
export { MyRoundVase };
