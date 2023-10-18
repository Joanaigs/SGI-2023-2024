import * as THREE from 'three';
import { MyApp } from './MyApp.js';
import { MyPlate } from './MyPlate.js';
import { MyCandle } from './MyCandle.js';

/**
 * This class contains a Cake Slice representation
 */
class MyCakePiece extends THREE.Object3D {

    /**
     * 
     * @param {MyApp} app the application object
     * @param {hex} color hex color of the cake
     * @param {list} position position of the cake piece
     * @param {bool} castShadow true if the cake piece casts shadows
     *
     */
    constructor(app, color, position, castShadow=false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.color = color;

        this.plate = new MyPlate(this, 0.5, 0xf5e9dc, position, castShadow);
        this.add(this.plate);
        let plateHeight = this.plate.plateHeight();

        const material = new THREE.MeshPhongMaterial({ color: color });
        const toppingMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        let topping = new THREE.SphereGeometry(0.1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);

        // Define cake pieceCakeInfos and heights
        const pieceCakeInfo = { radiusTop: 0.5, radiusBottom: 0.5, height: 0.4 };

        let currentHeight = plateHeight;

        let geometry = new THREE.CylinderGeometry(pieceCakeInfo.radiusTop, pieceCakeInfo.radiusBottom, pieceCakeInfo.height, 32, 1, false, 0, Math.PI / 3);

        const cake = new THREE.Mesh(geometry, material);
        if(castShadow){
            cake.castShadow = true;
            cake.receiveShadow = true;
        }

        cake.position.set(position[0] -0.15  , position[1] + currentHeight + pieceCakeInfo.height / 2, position[2] -0.15 );
        this.add(cake);

        // Toppingsf
        const ang = (2 * Math.PI) / 6;
        const top = new THREE.Mesh(topping, toppingMaterial);
        top.position.set(position[0] + (pieceCakeInfo.radiusBottom - 0.1) * Math.cos(ang) - 0.15, position[1] + currentHeight + pieceCakeInfo.height, position[2] + (pieceCakeInfo.radiusBottom - 0.1) * Math.sin(ang) - 0.15);
        this.add(top);

        // Add rectangles to close the sides
        const sideGeometry = new THREE.PlaneGeometry(pieceCakeInfo.radiusBottom , pieceCakeInfo.height);
        const sideMaterial = new THREE.MeshPhongMaterial({ color: 0xffc2d9 });

        const side1 = new THREE.Mesh(sideGeometry, sideMaterial);
        side1.rotateY(-Math.PI / 2); // Rotate to match the angle of the cake slice
        side1.position.set(position[0]  -0.15 , position[1] + currentHeight + pieceCakeInfo.height / 2, position[2] -0.15 + pieceCakeInfo.radiusBottom/2  );
        this.add(side1);

        const side2 = new THREE.Mesh(sideGeometry, sideMaterial);
        side2.rotateY(Math.PI / 2 + Math.PI/3); // Rotate to match the angle of the cake slice
        side2.position.set(
            position[0] + (pieceCakeInfo.radiusTop/2)* Math.sin(Math.PI/3) -0.15 , // Adjust this value as needed
            position[1] + currentHeight + pieceCakeInfo.height / 2,
            position[2]  + (pieceCakeInfo.radiusTop/2)* Math.cos(Math.PI/3) -0.15// Adjust this value as needed
        );
        this.add(side2);
    }
}

MyCakePiece.prototype.isGroup = true;
export { MyCakePiece };
