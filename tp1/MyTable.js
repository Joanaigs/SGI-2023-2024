import * as THREE from 'three';
import { MyChair } from './MyChair.js';


/**
 * This class contains a Table representation
 */
export class MyTable extends THREE.Object3D {
    constructor(app, topLength, topWidth, legHeight, color, topColor, position, chair=false) {
        super();
        this.type = 'Group';
        this.app = app;
        this.topLength = topLength;
        this.topWidth = topWidth;
        this.legHeight = legHeight;
        this.color = color;
        this.topColor = topColor;
        this.position.set(position[0], position[1], position[2]);

        // Material for the table
        this.materialTexture =new THREE.TextureLoader().load(this.topColor);
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 50;
        this.materialWood = new THREE.MeshStandardMaterial({ color: this.diffusePlaneColor, 
            specular: this.specularPlaneColor, emissive: "#000000", shininess: this.planeShininess, map: this.materialTexture });


        this.thinTexture =new THREE.TextureLoader().load(this.color);
        this.diffusePlaneColor = "#FFFFFF";
        this.specularPlaneColor = "#777777";
        this.planeShininess = 50;
        this.materialThin = new THREE.MeshStandardMaterial({ color: this.diffusePlaneColor, 
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
            this.add(tableLeg);
        }
    }

    createTableTop(materialWood, materialThin){
        const geometryTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.2);
        const tableTop = new THREE.Mesh(geometryTop, materialWood);
        tableTop.position.set(this.position.x, this.legHeight - 0.15, this.position.z + 0.05);
        tableTop.rotateX(-Math.PI / 2);
        this.add(tableTop);

        const geometryThinTop = new THREE.BoxGeometry(this.topLength, this.topWidth, 0.1);
        const thinTop = new THREE.Mesh(geometryThinTop, materialThin);
        thinTop.position.set(this.position.x, this.legHeight, this.position.z + 0.05);
        thinTop.rotateX(-Math.PI / 2);
        this.add(thinTop);
        
    }

    createChair(){
        const chairPositions = [
            [this.position.x + this.topLength/2, this.position.y, this.position.z, Math.PI/2],
            [this.position.x - this.topLength/2, this.position.y, this.position.z, -Math.PI/2],
            [this.position.x + this.topLength/6, this.position.y, this.position.z - this.topWidth/2, Math.PI],
            [this.position.x + this.topLength/6, this.position.y, this.position.z + this.topWidth/2, 0],
            [this.position.x - this.topLength/6, this.position.y, this.position.z - this.topWidth/2, Math.PI],
            [this.position.x - this.topLength/6, this.position.y, this.position.z + this.topWidth/2, 0],
            ];

        for (const chairPos of chairPositions) {
            const chair = new MyChair(this.app, 1, [chairPos[0], chairPos[1], chairPos[2]], chairPos[3], this.color);
            this.add(chair);
        }

    }
    
}

MyTable.prototype.isGroup = true;
