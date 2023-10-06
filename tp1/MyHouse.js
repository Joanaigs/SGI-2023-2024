import * as THREE from 'three';

/**
 * This class contains a Floor representation
 */
class MyHouse extends THREE.Object3D {
    constructor(app) {
        super();
        this.app = app;
        this.type = 'Group';
        let size = 15;
        this.createWalls(size);
    }

    createWalls(size) {
        const wallDimensions = [
            { width: size * 3, height: size }, // Wall 1
            { width: size * 3, height: size }, // Wall 2
            { width: size * 2, height: size }, // Wall 3
            { width: size * 2, height: size }, // Wall 4
        ];

        const material = new THREE.MeshStandardMaterial({ color: 0xD5D4CA });

        for (let i = 0; i < wallDimensions.length; i++) {
            const wall = new THREE.Mesh(new THREE.PlaneGeometry(wallDimensions[i].width, wallDimensions[i].height), material);
            if (i === 0) {
                wall.rotation.y = -Math.PI / 2;
                wall.position.x = size;
                wall.position.y = wallDimensions[i].height / 2;
                wall.position.z = size/2;
            } else if (i === 1) {
                wall.rotation.y = Math.PI / 2;
                wall.position.x = -size;
                wall.position.y = wallDimensions[i].height / 2;
                wall.position.z = size/2;
            } else if (i === 2) {
                wall.rotation.y = -Math.PI;
                wall.position.z = size * 2;
                wall.position.y = wallDimensions[i].height / 2;
            } else if (i === 3) {
                wall.rotation.y = 0;
                wall.position.z = -size;
                wall.position.y = wallDimensions[i].height / 2;
            }

            this.add(wall);
        }
    }

}

MyHouse.prototype.isGroup = true;
export { MyHouse };
