import * as THREE from 'three';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * This class contains a Pillow representation
 */
class MyPillow extends THREE.Object3D {
    constructor(app, length, width, height, color, position,  shadow = false) {
        super();
        this.app = app;
        this.length = length;
        this.width = width;
        this.height = height;
        this.shadow = shadow;
        this.color = color;
        this.meshes = [];
        this.samplesU = 20;
        this.samplesV = 20;
        this.builder = new MyNurbsBuilder();
        this.material = new THREE.MeshPhongMaterial({
            color: this.color,
            side: THREE.DoubleSide,
        });

        this.createNurbsSurfaces();
        this.scale.set(this.width, this.height, this.length);
        this.position.set(position[0], position[1], position[2]);
        this.rotateY(Math.PI/2);
    }

    /**
     * Creates the vase
     */
    createNurbsSurfaces() {
        let controlPoints1;
        let surfaceData1;
        let mesh1, mesh2;
        let orderU = 4; 
        let orderV = 3; 

        // Define control points for half of the pillow
        controlPoints1 = [
            // U = 0
            [
                [-0.2, 0.2, 0.0, 1],
                [-0.2, 0.2, 0.0, 1],  // Coordena X inalterada para criar um lado reto
                [0.0, 0.2, 0.0, 1],  // Coordena X inalterada para criar um lado reto
                [0.2, 0.2, 0.0, 1],
            ],
            // U = 1
            [
                [-0.2, -0.2, 0.0, 1],
                [-0.2, -0.2, 0.0, 1],  // Coordena X inalterada para criar um lado reto
                [0.0, -0.2, 0.0, 1],  // Coordena X inalterada para criar um lado reto
                [0.2, -0.2, 0.0, 1],
            ],
            // U = 2
            [
                [-0.2, -0.2, 0.0, 1],
                [-0.2, -0.2, 0.0, 1],  // Coordena X inalterada para criar um lado reto
                [0.0, -0.2, 0.0, 1],  // Coordena X inalterada para criar um lado reto
                [0.2, -0.2, 0.0, 1],
            ],
            // U = 3
            [
                [-0.2, 0.2, 0.0, 1],
                [-0.2, 0.2, -0.2, 1], 
                [0.0, 0.2, -0.2, 1],  // Coordena X inalterada para criar um lado reto
                [0.2, 0.2, 0.0, 1],
            ],
            [
                [-0.2, 0.2, 0, 1], 
                [-0.2, 0.2, 0, 1],  
                [0.0, 0.2, 0, 1],  // Coordena X inalterada para criar um lado reto
                [0.2, 0.2, 0, 1],   
            ],
        ];


        surfaceData1 = this.builder.build(
            controlPoints1,
            orderU,
            orderV,
            this.samplesU,
            this.samplesV,
            this.material
        );

        mesh1 = new THREE.Mesh(surfaceData1, this.material);
        if(this.shadow){
            mesh1.castShadow = true;
            mesh1.receiveShadow = true;
        }
        this.add(mesh1);

        mesh2 = new THREE.Mesh(surfaceData1, this.material);
        if(this.shadow){
            mesh2.castShadow = true;
            mesh2.receiveShadow = true;
        }

        mesh2.rotateY(Math.PI);
        this.add(mesh2);

        this.meshes.push(mesh1);
    }
}

MyPillow.prototype.isGroup = true;
export { MyPillow };
