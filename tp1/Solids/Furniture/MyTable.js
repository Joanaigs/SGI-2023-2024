import * as THREE from 'three';
import { MyChair } from './MyChair.js';
import { MyApp } from '../../MyApp.js';


/**
 * This class contains a Table representation
 */
export class MyTable extends THREE.Object3D {
    /**
     * 
     * @param {MyApp} app the application object
     * @param {number} topLength the length of the table top
     * @param {number} topWidth the width of the table top
     * @param {number} legHeight the height of the table legs
     * @param {THREE.MeshPhongMaterial} materialTableBase the material of the table base (the plank)
     * @param {THREE.MeshPhongMaterial} materialTableLegs the material of the legs of the table
     * @param {list} position the position of the table
     * @param {bool} chair has chairs or not
     * @param {bool} shadows has shadows or not
     */
    constructor(app, topLength, topWidth, legHeight, materialTableBase, materialTableLegs, position, chair=false, shadows=false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.topLength = topLength;
        this.topWidth = topWidth;
        this.legHeight = legHeight;
        this.materialTableLegs = materialTableLegs
        this.materialTableBase = materialTableBase
        this.position.set(position[0], position[1], position[2]);
        this.shadows = shadows;

        this.createTableTop();
        this.createTableLegs();
        if(chair){
            this.createChair();
        }

    }

    /**
     * Creates the table legs
     */
    createTableLegs(){
        const legPositions = [
            [-(this.topLength / 2) +0.3, -(this.topWidth / 2) +0.3],
            [-(this.topLength / 2) +0.3, this.topWidth / 2 -0.3 ],
            [this.topLength / 2 -0.3, -(this.topWidth / 2) +0.3],
            [this.topLength / 2 -0.3, this.topWidth / 2 -0.3],
        ];

        for (const [legX, legZ] of legPositions) {
            const geometryLeg = new THREE.CylinderGeometry(0.2, 0.05, this.legHeight, 32);
            const tableLeg = new THREE.Mesh(geometryLeg, this.materialTableLegs);
            tableLeg.position.set(
                this.position.x + legX,
                this.legHeight / 2,
                this.position.z + legZ
            );
            if(this.shadows){
                tableLeg.castShadow = true;
                tableLeg.receiveShadow = true;
            }
            this.add(tableLeg);
        }
    }

    /**
     * Creates the table top
     */
    createTableTop(){
        const geometryTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.2);
        const tableTop = new THREE.Mesh(geometryTop, this.materialTableLegs);
        if(this.shadows){
            tableTop.castShadow = true;
            tableTop.receiveShadow = true;
        }
        tableTop.rotateX(-Math.PI / 2);
        tableTop.position.set(this.position.x, this.legHeight - 0.15, this.position.z + 0.05);
        this.add(tableTop);

        const geometryThinTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.1);
        const thinTop = new THREE.Mesh(geometryThinTop, this.materialTableBase);
        if(this.shadows){
            thinTop.castShadow = true;
            thinTop.receiveShadow = true;
        }
        thinTop.rotateX(-Math.PI / 2);
        thinTop.position.set(this.position.x, this.legHeight, this.position.z + 0.05);
        this.add(thinTop);
        
    }

    /**
     * Creates the chairs around the table
     */
    createChair(){
        const chairPositions = [
            [this.position.x + this.topLength/4, this.position.y, this.position.z - this.topWidth/2, Math.PI],
            [this.position.x + this.topLength/4, this.position.y, this.position.z + this.topWidth/2, 0],
            [this.position.x - this.topLength/4, this.position.y, this.position.z - this.topWidth/2, Math.PI],
            [this.position.x - this.topLength/4, this.position.y, this.position.z + this.topWidth/2, 0],
            ];

        for (const chairPos of chairPositions) {
            const chair = new MyChair(this.app, 1, [chairPos[0], chairPos[1], chairPos[2]], chairPos[3], this.materialTableBase, this.shadows);
            this.add(chair);
        }

    }
    
}

MyTable.prototype.isGroup = true;
