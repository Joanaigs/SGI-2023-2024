import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
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
        this.samplesU = 20; 
        this.samplesV = 20; 
        this.builder = new MyNurbsBuilder();
        this.texture = this.app.textureVase;
        this.texture.rotation = Math.PI/2;
        this.texture.repeat.set(1, 2);
        this.material = new THREE.MeshPhysicalMaterial({
            color: this.color,
            side: THREE.DoubleSide,
            transmission:1,
            roughness:0.05,
            thickness: 0.01,
            //depthWrite: false
        });

        this.createNurbsSurfaces();
        this.scale.set(this.size, this.size, this.size);
        this.position.set(position[0], position[1]*this.size, position[2]);

    }

    /**
     * Creates the vase
     */
    createNurbsSurfaces() {
        let controlPoints1;
        let surfaceData1;
        let mesh1, mesh2;
        let orderU = 3; 
        let orderV = 3; 

        // Define control points for half of the vase
        controlPoints1 = [
            // U = 0
            [
                [-0.2, -1.0, 0.0, 1],
                [-0.2, -1.0, (4/3)*0.2, 1],
                [0.2,-1.0, (4/3)*0.2, 1],
                [0.2, -1.0, 0.0, 1],
            ],
            // U = 1
            [
                [-0.8, 0, 0, 1],
                [-0.8, 0, (4/3)*0.8, 1],
                [0.8, 0,  (4/3)*0.8, 1],
                [0.8, 0, 0, 1],
            ],
            // U = 2
            [
                [0.4, 0.8, 0.0, 1],
                [0.4, 0.8, -(4/3)*0.4, 1],
                [-0.4, 0.8, -(4/3)*0.4, 1],
                [-0.4, 0.8, 0.0, 1],
            ],
            // U = 3
            [
                [-0.4, 1.0, 0.0, 1],
                [-0.4, 1.0, (4/3)*0.4, 1],
                [0.4, 1.0, (4/3)*0.4, 1],
                [0.4, 1.0, 0.0, 1],
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
MyRoundVase.prototype.isGroup = true;
export { MyRoundVase };
