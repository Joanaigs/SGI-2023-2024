import * as THREE from 'three';
import { MyApp } from '../../MyApp.js';

/**
 * This class contains a House walls representation
 */
class MyHouse extends THREE.Object3D {
    /**
     * 
     * @param {MyApp} app the application object
     */
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        this.repeat_u = 2;
        this.repeat_v = 3;
        this.offset_u = 0;
        this.offset_v = 0;
        this.rotate = Math.PI/4;
        let size = 15;
        this.createWalls(size);
    }

    createWalls(size) {
        const wallDimensions = [
            { width: size * 3, height: size }, // Wall 1
            { width: size * 2, height: size }, // Wall 2
            { width: size * 2, height: size }, // Wall 3

        ];

        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const textureWallPaper = new THREE.TextureLoader().load('Textures/wallPaper1.jpg');
        textureWallPaper.wrapS = THREE.RepeatWrapping;
        textureWallPaper.wrapT = THREE.RepeatWrapping;
        textureWallPaper.rotation = this.rotate
        textureWallPaper.repeat.set(this.repeat_u, this.repeat_v);
        const materialPaper = new THREE.MeshPhongMaterial({ color: 0xffffff, map: textureWallPaper});

        const wall1 = new THREE.Mesh(new THREE.PlaneGeometry(wallDimensions[0].width, wallDimensions[0].height), material);
        wall1.rotation.y = -Math.PI / 2;
        wall1.position.x = size;
        wall1.position.y = wallDimensions[0].height / 2;
        wall1.position.z = size/2;
        this.add(wall1);

        const wall2 = new THREE.Mesh(new THREE.PlaneGeometry(wallDimensions[1].width, wallDimensions[1].height), material);
        wall2.rotation.y = -Math.PI;
        wall2.position.z = size * 2;
        wall2.position.y = wallDimensions[1].height / 2;
        this.add(wall2);
        
        const wall3 = new THREE.Mesh(new THREE.PlaneGeometry(wallDimensions[2].width, wallDimensions[2].height), materialPaper);
        wall3.rotation.y = 0;
        wall3.position.z = -size;
        wall3.position.y = wallDimensions[2].height / 2;
        this.add(wall3);

        //wall windows
        const wallLateralMidle = new THREE.Mesh(new THREE.PlaneGeometry(6, 10), material);
        wallLateralMidle.rotation.y = Math.PI / 2;
        wallLateralMidle.position.x = -size;
        wallLateralMidle.position.y = 5;
        wallLateralMidle.position.z = size/2;
        this.add(wallLateralMidle);

        const wallLateralRight = new THREE.Mesh(new THREE.PlaneGeometry(6, 10), material);
        wallLateralRight.rotation.y = Math.PI / 2;
        wallLateralRight.position.x = -size;
        wallLateralRight.position.y = 5;
        wallLateralRight.position.z = -15+3;
        this.add(wallLateralRight);

        const wallLateralLeft = new THREE.Mesh(new THREE.PlaneGeometry(6, 10), material);
        wallLateralLeft.rotation.y = Math.PI / 2;
        wallLateralLeft.position.x = -size;
        wallLateralLeft.position.y = 5;
        wallLateralLeft.position.z = 30-3;
        this.add(wallLateralLeft);

        const wallTop = new THREE.Mesh(new THREE.PlaneGeometry(45, 5), material);
        wallTop.rotation.y = Math.PI/2;
        wallTop.position.x = -15;
        wallTop.position.y = 10+2.5;
        wallTop.position.z = 15/2;
        this.add(wallTop);
        
    }

}

MyHouse.prototype.isGroup = true;
export { MyHouse };
