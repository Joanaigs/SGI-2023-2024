import * as THREE from 'three';
import { MyApp } from '../MyApp.js';
import { MyNurbsBuilder } from './MyNurbsBuilder.js';

/**
 * This class contains a Jornal representation
 */
class MyJornal extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} size the size of each axis 
     * @param {list} position the position of the jornal
     * @param {number} angle the angle of the Jornal
     * @param {number} num_pages the number of pages
     * @param {number} height the height of the jornal
     * @param {boolean} shadows if the jornal has shadows
     */
    constructor(app, size, position, angle, num_pages=5, height=0.4, shadows=false) {
        super();
        this.app = app;
        this.size = size || 2;
        this.meshes = [];
        this.samplesU = 20; // maximum defined in MyGuiInterface
        this.samplesV = 20; // maximum defined in MyGuiInterface
        this.builder = new MyNurbsBuilder();
        this.shadows = shadows;
        this.jornalMaterial = this.app.materialJornal;
        this.material = new THREE.MeshStandardMaterial({
            color: 0x999999,
            side: THREE.DoubleSide,
            map: this.jornalMaterial
        });
        this.num_pages = num_pages;
        this.height = height;

        this.createNurbsSurfaces();
        this.rotateZ(angle);
        this.position.set(position[0], position[1], position[2]);

    }

    /**
     * Creates the jornal
     */
    createNurbsSurfaces() {
        let controlPoints;
        let surfaceData;
        let mesh;
        let orderU = 1;
        let orderV = 2;

        // Define control points for jornal
        controlPoints = [
            // U = 0
            [
                [1, 0.2, 0.0, 1],
                [0, 0, 0.0, 1],
                [1, -0.2, 0.0, 1],
            ],
            // U = 1
            [
                [1, 0.2, 1, 1],
                [0, 0, 1, 1],
                [1, -0.2, 1, 1],
            ],
        ];
        let space = (this.height / this.num_pages);
        for (let i = 0; i < this.num_pages; i++) {
            controlPoints[0][0][1] = (1 - i * space) / 2;
            controlPoints[0][2][1] = -(1 - i * space) / 2;
            controlPoints[1][0][1] = (1 - i * space) / 2;
            controlPoints[1][2][1] = -(1 - i * space) / 2;

            surfaceData = this.builder.build(
                controlPoints,
                orderU,
                orderV,
                this.samplesU,
                this.samplesV,
                this.material
            );
            mesh = new THREE.Mesh(surfaceData, this.material);
            if(this.shadows){
                mesh.castShadow = true;
                mesh.receiveShadow = true;
            }
            this.scale.set(this.size*3, this.height, this.size*2);
            this.add(mesh);

            this.meshes.push(mesh);
        }
    }
}
MyJornal.prototype.isGroup = true;
export { MyJornal };