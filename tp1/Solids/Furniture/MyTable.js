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
     * @param {hex} color the color of the table legs
     * @param {hex} topColor the color of the table top
     * @param {list} position the position of the table
     * @param {bool} chair has chairs or not
     * @param {bool} shadows has shadows or not
     */
    constructor(app, topLength, topWidth, legHeight, color, topColor, position, chair=false, shadows=false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.topLength = topLength;
        this.topWidth = topWidth;
        this.legHeight = legHeight;
        this.color = color;
        this.topColor = topColor;
        this.shadows = shadows;
        this.position.set(position[0], position[1], position[2]);

        // Material for the table
        this.materialTexture =new THREE.TextureLoader().load(this.topColor);
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 50;
        this.materialWood = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.materialTexture });


        this.thinTexture =new THREE.TextureLoader().load(this.color);
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 50;
        this.materialThin = new THREE.MeshPhongMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.thinTexture });


        this.createTableTop(this.materialWood, this.materialThin);
        this.createTableLegs(this.materialWood);
        if(chair){
            this.createChair(this.color);
        }

    }

    createTableLegs(materialWood){
        const legPositions = [
            [-(this.topLength / 2) +0.3, -(this.topWidth / 2) +0.3],
            [-(this.topLength / 2) +0.3, this.topWidth / 2 -0.3 ],
            [this.topLength / 2 -0.3, -(this.topWidth / 2) +0.3],
            [this.topLength / 2 -0.3, this.topWidth / 2 -0.3],
        ];

        for (const [legX, legZ] of legPositions) {
            const geometryLeg = new THREE.CylinderGeometry(0.2, 0.05, this.legHeight, 32);
            const tableLeg = new THREE.Mesh(geometryLeg, materialWood);
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

    createTableTop(materialWood, materialThin){
        const geometryTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.2);
        const tableTop = new THREE.Mesh(geometryTop, materialWood);
        if(this.shadows){
            tableTop.castShadow = true;
            tableTop.receiveShadow = true;
        }
        tableTop.rotateX(-Math.PI / 2);
        tableTop.position.set(this.position.x, this.legHeight - 0.15, this.position.z + 0.05);
        this.add(tableTop);

        const geometryThinTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.1);
        const thinTop = new THREE.Mesh(geometryThinTop, materialThin);
        if(this.shadows){
            thinTop.castShadow = true;
            thinTop.receiveShadow = true;
        }
        thinTop.rotateX(-Math.PI / 2);
        thinTop.position.set(this.position.x, this.legHeight, this.position.z + 0.05);
        this.add(thinTop);
        
    }

    createChair(){
        const chairPositions = [
            [this.position.x + this.topLength/4, this.position.y, this.position.z - this.topWidth/2, Math.PI],
            [this.position.x + this.topLength/4, this.position.y, this.position.z + this.topWidth/2, 0],
            [this.position.x - this.topLength/4, this.position.y, this.position.z - this.topWidth/2, Math.PI],
            [this.position.x - this.topLength/4, this.position.y, this.position.z + this.topWidth/2, 0],
            ];

        for (const chairPos of chairPositions) {
            const chair = new MyChair(this.app, 1, [chairPos[0], chairPos[1], chairPos[2]], chairPos[3], this.color, this.shadows);
            this.add(chair);
        }

    }
    
}

MyTable.prototype.isGroup = true;
